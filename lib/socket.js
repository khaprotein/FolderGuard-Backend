const socketIo = require("socket.io");

let io;
const onlineUsers = new Map(); 

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: { 
            origin: "http://localhost:5000",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`User kết nối: ${socket.id}`);

        socket.on("user_connected", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(` User ${userId} đã online`);
            console.log(" Online Users:", [...onlineUsers.entries()]); // Log danh sách online users
        });

        socket.on("disconnect", () => {
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} đã offline`);
                    break;
                }
            }
            console.log(" Online Users (After Disconnect):", [...onlineUsers.entries()]);
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.IO chưa được khởi tạo!");
    }
    return io;
};

const getOnlineUsers = () => {
    console.log("Online Users:", [...onlineUsers.entries()]);
    return onlineUsers;
};

const sendNotification = (user_id, notification) => {
    if (!io) {
        console.error("Lỗi: io chưa được khởi tạo!");
        return;
    }
    // Lấy socketId của user
    const socketId = onlineUsers.get(user_id);

    if (!socketId) {
        console.warn(` User ${user_id} không online, không thể gửi thông báo.`);
        return;
    }

    console.log(`Gửi thông báo đến user ${user_id} (Socket ID: ${socketId}):`, notification);
    io.to(socketId).emit("new_notification", notification);
};

module.exports = { initializeSocket, getIo, getOnlineUsers, sendNotification };
