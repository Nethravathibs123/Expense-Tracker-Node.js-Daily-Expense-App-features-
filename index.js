document.addEventListener('DOMContentLoaded', function () {
    let expenses = [];
    let totalAmount = 0;
    const amountInput = document.getElementById('amount-input');
    const descriptionInput = document.getElementById('description-input');
    const categorySelect = document.getElementById('category-select');
    const addBtn = document.getElementById('add-btn');
    const expensesTableBody = document.getElementById('expense-table-body');
    const totalAmountCell = document.getElementById('total-amount');
    const port = 3000; // Specify the backend port

    // Fetch old expenses on page load
    async function fetchExpenses() {
        try {
            const response = await axios.get(`http://localhost:${port}/expenses`);
            expenses = response.data; // Assuming the response returns an array of expenses
            expenses.forEach(addExpenseToTable);
            updateTotalAmount();
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    // Call fetchExpenses on load
    fetchExpenses();

    addBtn.addEventListener('click', async function () {
        const amount = parseFloat(amountInput.value);
        const description = descriptionInput.value.trim();
        const category = categorySelect.value;

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (description === '') {
            alert('Please enter a description');
            return;
        }
        if (category === '') {
            alert('Please select a category');
            return;
        }

        const expense = { amount, description, category };
        try {
            const response = await axios.post(`http://localhost:${port}/expenses`, expense);
            expenses.push(response.data); // Add the newly created expense
            totalAmount += amount;
            updateTotalAmount();
            addExpenseToTable(response.data); // Add to the table
            clearForm();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    });

    function addExpenseToTable(expense) {
        const newRow = expensesTableBody.insertRow();
        const amountCell = newRow.insertCell();
        amountCell.textContent = expense.amount;
        const descriptionCell = newRow.insertCell();
        descriptionCell.textContent = expense.description;
        const categoryCell = newRow.insertCell();
        categoryCell.textContent = expense.category;
        const actionsCell = newRow.insertCell();

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteExpense(newRow, expense);
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', function () {
            editExpense(expense);
        });

        actionsCell.appendChild(deleteBtn);
        actionsCell.appendChild(editBtn);
    }

    async function deleteExpense(row, expense) {
        try {
            await axios.delete(`http://localhost:${port}/expenses/${expense.id}`); // Assuming expense has an `id` field
            const index = expenses.indexOf(expense);
            if (index !== -1) {
                expenses.splice(index, 1);
                totalAmount -= expense.amount;
                updateTotalAmount();
                row.remove();
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }

    function editExpense(expense) {
        amountInput.value = expense.amount;
        descriptionInput.value = expense.description;
        categorySelect.value = expense.category;
        addBtn.disabled = true;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.classList.add('save-btn');
        saveBtn.addEventListener('click', function () {
            saveExpense(expense);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.classList.add('cancel-btn');
        cancelBtn.addEventListener('click', function () {
            cancelEdit();
        });

        addBtn.parentNode.appendChild(saveBtn);
        addBtn.parentNode.appendChild(cancelBtn);
    }

    async function saveExpense(expense) {
        const newAmount = parseFloat(amountInput.value);
        const newDescription = descriptionInput.value.trim();
        const newCategory = categorySelect.value;

        if (isNaN(newAmount) || newAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (newDescription === '') {
            alert('Please enter a description');
            return;
        }
        if (newCategory === '') {
            alert('Please select a category');
            return;
        }

        try {
            await axios.put(`http://localhost:${port}/expenses/${expense.id}`, {
                amount: newAmount,
                description: newDescription,
                category: newCategory,
            });

            totalAmount += newAmount - expense.amount;
            updateTotalAmount();
            expense.amount = newAmount;
            expense.description = newDescription;
            expense.category = newCategory;

            const row = expensesTableBody.rows[expenses.indexOf(expense)];
            row.cells[0].textContent = newAmount;
            row.cells[1].textContent = newDescription;
            row.cells[2].textContent = newCategory;

            cancelEdit();
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    }

    function cancelEdit() {
        addBtn.disabled = false;
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.remove();
        }
        const cancelBtn = document.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        clearForm();
    }

    function updateTotalAmount() {
        totalAmountCell.textContent = totalAmount.toFixed(2);
    }

    function clearForm() {
        amountInput.value = '';
        descriptionInput.value = '';
        categorySelect.value = '';
    }
});
