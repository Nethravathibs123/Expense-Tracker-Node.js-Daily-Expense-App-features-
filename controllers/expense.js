const expenses = []; // Array to store expenses temporarily; replace with database logic as needed

exports.getAllExpenses = (req, res) => {
  res.json(expenses);
};

exports.addExpense = (req, res) => {
  const { amount, description, category } = req.body;
  const id = expenses.length ? expenses[expenses.length - 1].id + 1 : 1;
  const expense = { id, amount, description, category };
  expenses.push(expense);
  res.status(201).json(expense);
};

exports.updateExpense = (req, res) => {
  const { id } = req.params;
  const { amount, description, category } = req.body;
  const expense = expenses.find(exp => exp.id == id);
  
  if (expense) {
    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    res.json(expense);
  } else {
    res.status(404).json({ message: 'Expense not found' });
  }
};

exports.deleteExpense = (req, res) => {
  const { id } = req.params;
  const index = expenses.findIndex(exp => exp.id == id);
  
  if (index !== -1) {
    expenses.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Expense not found' });
  }
};
