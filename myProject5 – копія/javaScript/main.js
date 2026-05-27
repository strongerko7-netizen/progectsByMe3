

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

