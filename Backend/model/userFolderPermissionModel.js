const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");

const UFPermission = sequelize.define(
  "UFPermission",
  {
    permission_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(50),
    },
    folder_id: {
      type: DataTypes.STRING(50),
    },
    access_level: {
      type: DataTypes.STRING(20), // 'read', 'read-write'
    },
    notes: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING(20), // DRAFT, PENDING, DONE, etc.
    },
    created_by: {
      type: DataTypes.STRING(50), // user_id người thao tác
    }
  },
  {
    tableName: "user_folder_permissions",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = UFPermission;
