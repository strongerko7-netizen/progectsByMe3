
let visitors = JSON.parse(localStorage.getItem('visitors')) || [];

function saveVisitors() {
    localStorage.setItem('visitors', JSON.stringify(visitors));
}

function addVisitor() {
    const name = document.getElementById('visitorName').value.trim();
    const contact = document.getElementById('visitorContact').value.trim();

    if (!name || !contact) {
        alert("Заповніть всі поля!");
        return;
    }

    visitors.push({ name, contact });
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

function renderVisitors() {
    const tbody = document.getElementById('visitorsTable');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (visitors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-gray-500">Немає відвідувачів</td></tr>`;
        return;
    }

    visitors.forEach((v, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4">${v.name}</td>
            <td class="px-6 py-4">${v.contact}</td>
            <td class="px-6 py-4 text-center">
                <button onclick="deleteVisitor(${index})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function showAddVisitorModal() {
    document.getElementById('addVisitorModal').classList.remove('hidden');
}

function hideAddVisitorModal() {
    document.getElementById('addVisitorModal').classList.add('hidden');
}

