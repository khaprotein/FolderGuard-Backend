const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");

const Department = sequelize.define(
  "Department",
  {
    department_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.STRING(50),
    },
    department_name: {
      type: DataTypes.STRING(255),
    },
    department_code: {
      type: DataTypes.STRING(50),
    },
    description: {
      type: DataTypes.STRING,
    }

  },
  {
    tableName: "departments",
    timestamps: false,
    freezeTableName: true,
  }
);


module.exports = Department;
