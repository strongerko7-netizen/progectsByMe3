

let loans = JSON.parse(localStorage.getItem('loans')) || [];

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
        tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-gray-500">Немає видач</td></tr>`;
        return;
    }

    loans.forEach(loan => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4">${loan.book}</td>
            <td class="px-6 py-4">${loan.visitor}</td>
            <td class="px-6 py-4">${loan.date}</td>
        `;
        tbody.appendChild(tr);
    });
}


