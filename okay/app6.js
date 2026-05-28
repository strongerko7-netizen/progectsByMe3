
let books = JSON.parse(localStorage.getItem('books')) || [];
let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
let loans = JSON.parse(localStorage.getItem('loans')) || [];


function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = value;
    } else {
        console.warn("Missing element:", id);
    }
}


//----------------------------------------------//


const activeLoans = loans.filter(l => !l.returned).length;
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function addBook() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const quantity = parseInt(document.getElementById('bookQuantity').value) || 1;
    const year = parseInt(document.getElementById('bookYear').value) || "";

    if (!title || !author) {
        alert("Заповніть назву та автора!");
        return;
    }

    books.push({ title, author, quantity });
    saveBooks();
    renderBooks();
    hideAddBookModal();
    updateLoanSelects ? updateLoanSelects() : null;
}

function deleteBook(index) {
    if (confirm(`Видалити "${books[index].title}"?`)) {
        books.splice(index, 1);
        saveBooks();
        renderBooks();
        updateLoanSelects ? updateLoanSelects() : null;
    }
}

function renderBooks(list = books) {
    const tbody = document.getElementById('booksTable');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Книг немає</td></tr>`;
        return;
    }

    list.forEach((book, index) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50";

        tr.innerHTML = `
            <td class="px-6 py-4">${book.title}</td>
            <td class="px-6 py-4">${book.author}</td>
            <td class="px-6 py-4">${book.year || "—"}</td>
            <td class="px-6 py-4">${book.quantity}</td>
            <td class="px-6 py-4 text-center">
                <button onclick="deleteBook(${index})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showAddBookModal() {
    document.getElementById('addBookModal').classList.remove('hidden');
}

function hideAddBookModal() {
    document.getElementById('addBookModal').classList.add('hidden');
}


const topVisitor = visitors.reduce((max, v) =>
    (v.booksCount || 0) > (max.booksCount || 0) ? v : max,
    visitors[0] || {});

const bookStats = {};

loans.forEach(l => {
    bookStats[l.book] = (bookStats[l.book] || 0) + 1;
});

let topBook = "";
let max = 0;

for (const title in bookStats) {
    if (bookStats[title] > max) {
        max = bookStats[title];
        topBook = title;
    }
}

function getTopBook() {
    const map = {};

    loans.forEach(l => {
        map[l.book] = (map[l.book] || 0) + 1;
    });

    let top = "-";
    let max = 0;

    for (const b in map) {
        if (map[b] > max) {
            max = map[b];
            top = b;
        }
    }

    return top;
}

function searchBooks() {
    const query = document.getElementById('searchBooks').value.toLowerCase();

    const filtered = books.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        String(b.year).includes(query)
    );

    renderBooks(filtered);
}


//-------------------- end_book --------------------------//

function saveLoans() {
    localStorage.setItem('loans', JSON.stringify(loans));
}

function updateLoanSelects() {
    const bookSelect = document.getElementById('loanBook');
    const visitorSelect = document.getElementById('loanVisitor');

    if (!bookSelect || !visitorSelect) return;

    bookSelect.innerHTML = '<option value="">Виберіть книгу</option>';
    visitorSelect.innerHTML = '<option value="">Виберіть відвідувача</option>';

    books.forEach((book, index) => {
        if (book.quantity > 0) {
            bookSelect.innerHTML += `<option value="${index}">${book.title} (${book.quantity})</option>`;
        }
    });

    visitors.forEach((visitor, index) => {
        visitorSelect.innerHTML += `<option value="${index}">${visitor.name}</option>`;
    });
}

function addLoan() {
    const bookIndex = document.getElementById('loanBook').value;
    const visitorIndex = document.getElementById('loanVisitor').value;

    if (!bookIndex || !visitorIndex) {
        alert("Виберіть книгу та відвідувача!");
        return;
    }

    const book = books[bookIndex];
    if (book.quantity <= 0) {
        alert("Цієї книги немає в наявності!");
        return;
    }

    // Зменшуємо кількість книги
    book.quantity -= 1;

    // Додаємо запис про видачу
    loans.push({
        book: book.title,
        visitor: visitors[visitorIndex].name,
        date: new Date().toLocaleDateString('uk-UA')
    });

    saveBooks();
    saveLoans();
    renderBooks();
    updateLoanSelects();

    alert("Книгу успішно видано!");
}

function renderLoans() {
    const tbody = document.getElementById('loansTable');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (loans.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    Немає видач
                </td>
            </tr>
        `;
        return;
    }

    loans.forEach((loan, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="px-6 py-4">${loan.book}</td>
            <td class="px-6 py-4">${loan.visitor}</td>
            <td class="px-6 py-4">${loan.date}</td>
            <td class="px-6 py-4 text-center space-x-2">

                ${!loan.returned
                ? `<button onclick="returnLoan(${index})"
                            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg">
                            Повернути
                           </button>`
                : `<span class="text-green-600 font-medium">Повернено ✓</span>`
            }

                ${loan.returned
                ? `<button onclick="deleteLoan(${index})"
                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg ml-2">
                            Видалити
                           </button>`
                : ''
            }

            </td>
        `;

        tbody.appendChild(tr);
    });
}

function returnLoan(index) {
    const loan = loans[index];

    if (loan.returned) return;

    books.find(b => b.title === loan.book).quantity++;
    loan.returned = true;

    saveBooks();
    saveLoans();

    renderBooks();
    renderLoans();
    renderStats();
}

function deleteLoan(index) {
    loans.splice(index, 1);
    saveLoans();
    renderLoans();
}





//------------------- end_loans ---------------------------------//


function renderStats() {
    setText('statBooks', books.length);

    setText('statCopies',
        books.reduce((sum, b) => sum + (b.quantity || 0), 0)
    );

    setText('statAuthors',
        new Set(books.map(b => b.author)).size
    );

    const activeLoans = loans.filter(l => !l.returned).length;
    setText('statActiveLoans', activeLoans);

    setText('statTopVisitor', '-');
    setText('statTopBook', '-');

    setText('statTopVisitor', getTopVisitor());
    setText('statTopBook', getTopBook());
}

// Оновлення статистики при змінах
function updateStats() {
    if (typeof renderStats === 'function') renderStats();
}

//--------------------- end_status? ---------------------//

function saveVisitors() {
    localStorage.setItem('visitors', JSON.stringify(visitors));
}


function renderVisitors() {
    const tbody = document.getElementById('visitorsTable');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (visitors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">Немає відвідувачів</td></tr>`;
        return;
    }

    visitors.forEach((v, index) => {
        const stats = getVisitorStats(v.name);
        const date = v.date || "—";

        const tr = document.createElement('tr');

        tr.innerHTML = `
        <td class="px-6 py-4">${v.name}</td>

        <td class="px-6 py-4">${v.contact}</td>

        <td class="px-6 py-4 text-sm leading-relaxed">
            <div><span class="font-semibold">${stats.total}</span> всього</div>
            <div><span class="font-semibold">${stats.active}</span> активні</div>
        </td>

        <td class="px-6 py-4">${date}</td>

        <td class="px-6 py-4 text-center">
            <button onclick="deleteVisitor(${index})" class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

        tbody.appendChild(tr);
    });
}


function addVisitor() {
    const name = document.getElementById('visitorName').value.trim();
    const contact = document.getElementById('visitorContact').value.trim();

    if (!name || !contact) {
        alert("Заповніть всі поля!");
        return;
    }

    const visitor = {
        name,
        contact,
        booksCount: 0,
        createdAt: new Date().toLocaleDateString()
    };

    visitors.push(visitor);

    saveVisitors();
    renderVisitors();
    hideAddVisitorModal();
    updateLoanSelects ? updateLoanSelects() : null;
}

function deleteVisitor(index) {
    if (confirm(`Видалити ${visitors[index].name}?`)) {
        visitors.splice(index, 1);
        saveVisitors();
        renderVisitors();
        updateLoanSelects ? updateLoanSelects() : null;
    }
}



function showAddVisitorModal() {
    document.getElementById('addVisitorModal').classList.remove('hidden');
}

function hideAddVisitorModal() {
    document.getElementById('addVisitorModal').classList.add('hidden');
}

function getTopVisitor() {
    const map = {};

    loans.forEach(l => {
        map[l.visitor] = (map[l.visitor] || 0) + 1;
    });

    let top = "-";
    let max = 0;

    for (const v in map) {
        if (map[v] > max) {
            max = map[v];
            top = v;
        }
    }

    return top;
}

function getVisitorStats(name) {
    const userLoans = loans.filter(l => l.visitor === name);

    return {
        total: userLoans.length,
        active: userLoans.filter(l => !l.returned).length
    };
}



//------------------ end_visitors ----------------------------------//




function showSection(n) {
    document.querySelectorAll('.section')
        .forEach(sec => sec.classList.add('hidden'));

    document.getElementById(`section${n}`)
        .classList.remove('hidden');

    document.querySelectorAll('.menu-item')
        .forEach(item => item.classList.remove('active'));

    document.getElementById(`menu${n}`)
        .classList.add('active');

    const titles = {
        1: "Облік книг",
        2: "Облік відвідувачів",
        3: "Видача та повернення",
        4: "Статистика"
    };

    document.getElementById('page-title').textContent = titles[n];

    if (n === 3) {
        updateLoanSelects();
        renderLoans();
    }

    if (n === 4) {
        renderStats();
    }
}

function initApp() {
    renderBooks();
    renderVisitors();
    renderLoans();
    updateLoanSelects();
    renderStats();

    showSection(1);
}

window.onload = initApp;


//----------------------------- system_core ------------------------------------------//

