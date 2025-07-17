const { DataTypes } = require("sequelize");
const sequelize = require("../lib/dbConfig");
const User = require("../model/userModel")

const Notification = sequelize.define("Notification", {
    notification_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
          type: DataTypes.STRING(50),
       
    },
    title: {
        type: DataTypes.STRING(255),
    },
    content: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.STRING(20),  
    }
}, {
    tableName: "notifications",
    timestamps: true,
    freezeTableName: true
});



module.exports = Notification;
