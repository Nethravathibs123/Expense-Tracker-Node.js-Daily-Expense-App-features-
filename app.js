const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const sequelize = require ('./util/database');


const Users = require ('./models/user');
const Expense = require('./models/expense');

app.use(express.static(path.join(__dirname, 'public')));
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense'); 



app.use(express.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes); 


const port = 3000;
sequelize
.sync()
.then((result) => {
    console.log(`server is working on http://localhost:${port}`);
   app.listen(port);
}).catch((err) => {
    console.log(err)
});

