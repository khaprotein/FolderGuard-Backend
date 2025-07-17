const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");

const Company = sequelize.define(
  "Company",
  {
    company_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    company_name: {
      type: DataTypes.STRING(255),
    },

    company_code: {
      type: DataTypes.STRING(100),
    },
    
    description: {
      type: DataTypes.STRING,
    }
    
  },
  {
    tableName: "companies",
    timestamps: false,
    freezeTableName: true,
  }
);



module.exports = Company;
