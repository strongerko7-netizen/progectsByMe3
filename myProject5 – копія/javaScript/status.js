function renderStats() {
    const totalBooks = books.length;
    
    const totalCopies = books.reduce((sum, book) => {
        return sum + (book.quantity || 0);
    }, 0);

    const uniqueAuthors = new Set(
        books.map(book => book.author ? book.author.toLowerCase().trim() : '')
    ).size;

    const statBooks = document.getElementById('statBooks');
    const statCopies = document.getElementById('statCopies');
    const statAuthors = document.getElementById('statAuthors');

    if (statBooks) statBooks.textContent = totalBooks;
    if (statCopies) statCopies.textContent = totalCopies;
    if (statAuthors) statAuthors.textContent = uniqueAuthors;
}

// Оновлення статистики при змінах
function updateStats() {
    if (typeof renderStats === 'function') renderStats();
}


