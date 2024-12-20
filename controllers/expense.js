const Expense = require('../models/expense');
;

// Controller for adding expenses
exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
      const newExpense = await Expense.create({
        description,  
          category,
          amount,
         // Mapped to details in the model
      });
      res.status(201).json(newExpense);
  } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ error: 'Error adding expense' });
  }
};

// Controller for getting all expenses
exports.getAllExpenses = async (req, res) => {
  try {
      const expenses = await Expense.findAll();
      res.status(200).json(expenses);
  } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Error fetching expenses' });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  const expenseId = req.params.id;
  const { amount, description, category } = req.body;

  try {
      const expense = await Expense.findByPk(expenseId);
      if (!expense) {
          return res.status(404).json({ error: 'Expense not found.' });
      }

      // Update expense fields
      expense.amount = amount;
      expense.description = description;
      expense.category = category;
      await expense.save();

      res.status(200).json(expense);
  } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'An error occurred while updating the expense.' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
      const expense = await Expense.findByPk(expenseId);
      if (!expense) {
          return res.status(404).json({ error: 'Expense not found.' });
      }

      await expense.destroy();
      res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'An error occurred while deleting the expense.' });
  }
};
