const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");
const User = require("./userModel");
const Department = require("./departmentModel");
const Folder = require("./folderModel");

const ApprovalSession = sequelize.define(
  "ApprovalSession",
  {
    session_id: {
      type: DataTypes.STRING(50),
      primaryKey: true
  },
  created_by: {
      type: DataTypes.STRING(50),
     
  },
  department_id: {
      type: DataTypes.STRING(50),
     
  },
    company_id: {
      type: DataTypes.STRING(50),
     
  },
  session_type:{
    type: DataTypes.STRING(50),

  },
   status: {
      type: DataTypes.STRING(20),
   
  },
  approved_by: {
      type: DataTypes.STRING(50),
  },
  description:{
    type: DataTypes.STRING,
  }
  },
  {
    tableName: "approval_sessions",
    timestamps: true,
    freezeTableName: true,
  }
)

module.exports = ApprovalSession;