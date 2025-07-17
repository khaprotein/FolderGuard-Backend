const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../lib/dbConfig"); 
const Company = require('./companyModel');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING(255),
  
  },
  email: {
    type: DataTypes.STRING(255),
   
  },
  puid: {
    type: DataTypes.STRING(100),
  },
  password: {
    type: DataTypes.STRING(255),
  },
  system_role: {
    type: DataTypes.STRING(50),
  } ,
  company_id: {
    type: DataTypes.STRING(50),
  } 

}, {
  tableName: 'users',
  timestamps: false,
  freezeTableName: true,
});


module.exports = User;
