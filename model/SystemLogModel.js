const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");

const SystemLog = sequelize.define("SystemLog", {
  log_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  company_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  department_id: {
    type: DataTypes.STRING(50),
  },
  action_by: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  target_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  target_id: {
    type: DataTypes.STRING(50),
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  tableName: "system_logs",
  timestamps: true,
});

module.exports = SystemLog;