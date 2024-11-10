
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
  id : {
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
 
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type:Sequelize.ENUM,
        values:['Food & Beverage','Fuel','Transport','Movie'],
        allowNull:false
  },
  
});

module.exports = Expense;
