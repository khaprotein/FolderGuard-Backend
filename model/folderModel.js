const { DataTypes } = require('sequelize');
const sequelize = require("../lib/dbConfig")

const Folder = sequelize.define('Folder', {
  folder_id: {
    type: DataTypes.STRING(50),
     primaryKey: true,
     
  },
  department_id: {
    type: DataTypes.STRING(50),

  },
  folder_name: {
    type: DataTypes.STRING(255),

  },
  folder_level: {
    type: DataTypes.INTEGER,

  },
  folder_path: {
    type: DataTypes.STRING
  },
  parent_folder_id: {
    type: DataTypes.STRING(50),
  },
  is_locked: {
    type: DataTypes.BOOLEAN
  },
  status:{
    type: DataTypes.STRING(20),
  },
  created_by: {
    type: DataTypes.STRING(50),
  }
}, {
  tableName: 'folders',
  timestamps: true,
  freezeTableName: true
});


module.exports = Folder;
