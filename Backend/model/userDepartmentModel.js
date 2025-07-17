const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");
const User = require("./userModel");
const Department = require("./departmentModel");

const UserDepartment = sequelize.define("UserDepartment", {
    user_department_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    department_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    notes:{
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: "user_department_roles",
    timestamps: false,
    freezeTableName: true,
});



module.exports = UserDepartment;
