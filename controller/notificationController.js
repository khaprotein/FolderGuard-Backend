
const notificationService = require("../service/notificationService")
const User = require("../model/userModel");
const { getIo,getOnlineUsers} = require("../lib/socket"); // Import Socket.IO

// 📌 Lấy tất cả thông báo
const getAllNotification = async (req, res) => {
    try {
        const list = await notificationService.getAllNotification();
        res.status(200).json({list});
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông báo:", error);
        res.status(500).json({ error: "Lỗi server khi lấy thông báo" });
    }
};

// 📌 Lấy thông báo theo User ID
const getAllByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const list = await notificationService.getAllByUserId(userId);

        res.status(200).json({list});
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông báo theo User ID:", error);
        res.status(500).json({ error: "Lỗi server khi lấy thông báo" });
    }
};

// 📌 Lấy thông báo theo ID
const getById = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const noti = await notificationService.getById(notificationId);

        res.status(200).json({noti});

    } catch (error) {
        console.error("❌ Lỗi khi lấy thông báo theo ID:", error);
        res.status(500).json({ error: "Lỗi server khi lấy thông báo" });
    }
};

// 📌 Tạo thông báo
const createNotification = async (req, res) => {
    try {
        const notification = await notificationService.createNotification(req.body)
           
        // 🔥 Kiểm tra xem user có online không
        const socketId = onlineUsers.get(user_id);
        if (socketId) {
            io.to(socketId).emit("new_notification", { message });
        }

        res.status(201).json({ message: "Tạo thư mục thành công.", notification });
    } catch (error) {
        console.error("❌ Lỗi khi tạo thông báo:", error);
        res.status(500).json({ error: "Lỗi server khi tạo thông báo" });
    }
};

// 📌 Cập nhật trạng thái thông báo (đọc/chưa đọc)
const updateNotification = async (req, res) => {
    try {
        const { notification_id, status } = req.body;
        console.log("data:",notification_id, status)
        const noti = await notificationService.updateNotification(req.body);

        res.json({ message: "Cập nhật thông báo thành công" ,noti});
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật thông báo:", error);
        res.status(500).json({ error: "Lỗi server khi cập nhật thông báo" });
    }
};


const countUnreadNotifications = async (req, res) => {
    try {
        const { userId} = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Thiếu userId trong request" });
        }
        const count = await notificationService.countUnreadNotifications(userId)
        res.json({ count});
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật thông báo:", error);
        res.status(500).json({ error: "Lỗi server khi cập nhật thông báo" });
    }
};

module.exports = {
    getAllNotification,
    getAllByUserId,
    getById,
    createNotification,
    updateNotification,
    countUnreadNotifications
    
};
