let books = JSON.parse(localStorage.getItem('books')) || [];

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function addBook() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const quantity = parseInt(document.getElementById('bookQuantity').value) || 1;

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

function renderBooks() {
    const tbody = document.getElementById('booksTable');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">Книг немає</td></tr>`;
        return;
    }

    books.forEach((book, index) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50";
        tr.innerHTML = `
            <td class="px-6 py-4">${book.title}</td>
            <td class="px-6 py-4">${book.author}</td>
            <td class="px-6 py-4">${book.quantity}</td>
            <td class="px-6 py-4 text-center">
                <button onclick="deleteBook(${index})" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
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






