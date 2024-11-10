const amountInput = document.getElementById('amount-input');
const descriptionInput = document.getElementById('description-input');
const categorySelect = document.getElementById('category-select');
const addExpenseButton = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');

let expenses = [];
let editingIndex = -1;

// Function to render expenses on the page
function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const newli = document.createElement('li');
        newli.className = 'expense-content';
        newli.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;

        const dltButton = document.createElement('button');
        dltButton.textContent = 'Delete';
        dltButton.classList.add('delete-btn');
        dltButton.setAttribute('data-id', expense.id);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.setAttribute('data-index', index);

        newli.appendChild(dltButton);
        newli.appendChild(editButton);
        expenseList.appendChild(newli);
    });
}

// Function to fetch expenses from the backend
async function fetchExpenses() {
    try {
        const response = await axios.get('http://localhost:3000/expenses');
        expenses = response.data;
        renderExpenses();
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

// Add or update expense based on the editing mode
addExpenseButton.addEventListener('click', async () => {
    const amount = amountInput.value;
    const description = descriptionInput.value;
    const category = categorySelect.value;

    if (amount && description && category) {
        const newExpense = { amount, description, category };

        if (editingIndex === -1) {  // Add new expense
            try {
                const response = await axios.post('http://localhost:3000/expenses', newExpense);
                expenses.push(response.data);
                fetchExpenses();  // Re-fetch updated expenses
            } catch (error) {
                console.error('Error adding expense:', error);
            }
        } else {  // Edit existing expense
            try {
                const id = expenses[editingIndex].id;
                await axios.put(`http://localhost:3000/expenses/${id}`, newExpense);
                expenses[editingIndex] = newExpense;  // Update the local expense data
                editingIndex = -1;  // Reset editing index
                fetchExpenses();  // Re-fetch updated expenses
            } catch (error) {
                console.error('Error updating expense:', error);
            }
        }

        // Reset form inputs after adding/updating
        amountInput.value = '';
        descriptionInput.value = '';
        categorySelect.value = 'Food & Beverage';  // Reset to default category
    } else {
        alert('Please fill in all the details');
    }
});

// Handle delete and edit actions
expenseList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const id = event.target.getAttribute('data-id');
        try {
            await axios.delete(`http://localhost:3000/expenses/${id}`);
            expenses = expenses.filter(expense => expense.id !== parseInt(id));
            renderExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }

    if (event.target.classList.contains('edit-btn')) {
        const index = event.target.getAttribute('data-index');
        const expense = expenses[index];

        amountInput.value = expense.amount;
        descriptionInput.value = expense.description;
        categorySelect.value = expense.category;

        editingIndex = index;  // Set editing mode
    }
});

// Fetch and display initial list of expenses on page load
fetchExpenses();
