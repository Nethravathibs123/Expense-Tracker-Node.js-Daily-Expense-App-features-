const express = require('express');
const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/expense'); // Route file we'll create

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // Parses JSON data from the request body
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/expenses', expenseRoutes); // Route all /expenses requests to expenseRoutes

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
