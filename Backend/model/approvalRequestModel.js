const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");

const ApprovalRequest = sequelize.define("ApprovalRequest", {
  request_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  session_id: {
    type: DataTypes.STRING(50),
  },
  request_type: {
    type: DataTypes.STRING(50), 
  },
  target_id: {
    type: DataTypes.STRING(50), 
  },
  action_by: {
    type: DataTypes.STRING(50), 
  },
   request_data: {
    type: DataTypes.TEXT, 
  },
  approved_by: {
    type: DataTypes.STRING(50),
  },
  approved_at: {
    type: DataTypes.STRING(50),
  },
  status: {
    type: DataTypes.STRING(50), // DRAFT, PENDING, DONE
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "approval_requests",
  timestamps: true,
  freezeTableName: true,
});

module.exports = ApprovalRequest;
