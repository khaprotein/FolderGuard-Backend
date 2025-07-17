const Notification = require("../model/notificationModel");
const User = require("../model/userModel");
const companyService = require("../service/companyService");
const departmentService = require("../service/departmentService");
const userDepartmentService = require("../service/userDepartmentService");
const userService = require("../service/userService");

const { getOnlineUsers, getIo } = require("../lib/socket");

/**
 * Gửi thông báo theo loại hành động (CREATE, UPDATE, DELETE, PERMISSIONS)
 */
const sendNotificationByAction = async (action, department_id, user_id, data) => {
    try {
        const executor = await userService.findUserById(user_id);
        let users = await userDepartmentService.getKeyUsersInDepartment(department_id);
        users = users.filter(user => user.user_id !== user_id);

        const department = await departmentService.getDepartmentById(department_id);
        const company = await companyService.getCompanyById(department.company_id);
        console.log("company: ",company)
        const formattedDate = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

        let message = "";
        let detail = "";

        switch (action) {
            case "CREATE":
                message = `📂 Thư mục mới \"${data.name}\" đã được tạo trong phòng ban ${department.name}.`;
                detail = `<p><b>📌 Công ty:</b> ${company.name}</p>
                         <p><b>📁 Thư mục:</b> ${data.name}</p>
                         <p><b>📂 Phòng ban:</b> ${department.name}</p>
                         <p><b>👤 Người tạo:</b> ${executor.full_name} (${executor.puid})</p>
                         <p><b>🕒 Ngày tạo:</b> ${formattedDate}</p>`;
                break;

            case "UPDATE":
                message = `✏️ Thư mục \"${data.oldName}\" đã được cập nhật thành \"${data.newName}\".`;
                detail = `<p><b>📌 Công ty:</b> ${company.name}</p>
                         <p><b>📁 Thư mục:</b> ${data.oldName} ➝ ${data.newName}</p>
                         <p><b>📂 Phòng ban:</b> ${department.name}</p>
                         <p><b>👤 Người cập nhật:</b> ${executor.full_name} (${executor.puid})</p>
                         <p><b>🕒 Thời gian:</b> ${formattedDate}</p>`;
                break;

            case "DELETE":
                message = `🗑️ Thư mục \"${data.name}\" đã bị xóa khỏi phòng ban ${department.name}.`;
                detail = `<p><b>📌 Công ty:</b> ${company.name}</p>
                         <p><b>📁 Thư mục:</b> ${data.name}</p>
                         <p><b>📂 Phòng ban:</b> ${department.name}</p>
                         <p><b>👤 Người xóa:</b> ${executor.full_name} (${executor.puid})</p>
                         <p><b>🕒 Thời gian:</b> ${formattedDate}</p>`;
                break;

            case "ADD_PERMISSION":
                message = `🔑 Người dùng ${data.userPUID} đã được cấp quyền \"${data.accessLevel}\" trong thư mục \"${data.folderName}\".`;
                detail = `<p><b>📌 Công ty:</b> ${company.name}</p>
                         <p><b>📂 Thư mục:</b> ${data.folderName}</p>
                         <p><b>🔑 Quyền mới:</b> ${data.accessLevel}</p>
                         <p><b>📂 Phòng ban:</b> ${department.name}</p>
                         <p><b>👤 Người thực hiện:</b> ${executor.full_name} (${executor.puid})</p>
                         <p><b>🕒 Thời gian:</b> ${formattedDate}</p>`;
                break;

            case "UPDATE_PERMISSION":
                message = `🔄 Quyền của người dùng ${data.userPUID} trong thư mục \"${data.folderName}\" đã được cập nhật thành \"${data.newAccessLevel}\".`;
                detail = `<p><b>📌 Công ty:</b> ${company.name}</p>
                         <p><b>📂 Thư mục:</b> ${data.folderName}</p>
                         <p><b>🔄 Quyền mới:</b> ${data.newAccessLevel}</p>
                         <p><b>📂 Phòng ban:</b> ${department.name}</p>
                         <p><b>👤 Người thực hiện:</b> ${executor.full_name} (${executor.puid})</p>
                         <p><b>🕒 Thời gian:</b> ${formattedDate}</p>`;
                break;

            case "REMOVE_PERMISSION":
                message = `❌ Người dùng ${data.userPUID} đã bị xóa quyền khỏi thư mục \"${data.folderName}\".`;
                detail = `<p><b>📌 Công ty:</b> ${company.name}</p>
                         <p><b>📂 Thư mục:</b> ${data.folderName}</p>
                         <p><b>❌ Người bị xóa quyền:</b> ${data.userPUID}</p>
                         <p><b>📂 Phòng ban:</b> ${department.name}</p>
                         <p><b>👤 Người thực hiện:</b> ${executor.full_name} (${executor.puid})</p>
                         <p><b>🕒 Thời gian:</b> ${formattedDate}</p>`;
                break;

            default:
                console.error("❌ Hành động thông báo không hợp lệ.");
                return;
        }

        await Promise.all(users.map(user =>
            createNotification({ user_id: user.user_id, message, detail })
        ));

    } catch (error) {
        console.error("❌ Lỗi khi gửi thông báo:", error);
    }
};

const createNotification = async ({ user_id, message, detail }) => {
    try {
        const newNotification = await Notification.create({
            user_id,
            message,
            detail,
            status: "unread",
        });

        const io = getIo();
        const onlineUsers = getOnlineUsers();
        const socketId = onlineUsers.get(user_id);

        if (socketId) {
            io.to(socketId).emit("new_notification", { message });
        }

        return newNotification;
    } catch (error) {
        console.error("❌ Lỗi khi tạo thông báo:", error);
        throw new Error("Lỗi server khi tạo thông báo");
    }
};

const getAllNotification = async () => {
    const list = await Notification.findAll({ include: { model: User } });
    if (!list) throw new Error("List rỗng");
    return list;
};

const getAllByUserId = async (userId) => {
    const list = await Notification.findAll({
        where: { user_id: userId },
        include: { model: User }
    });
    if (!list) throw new Error("list rỗng");
    return list;
};

const getById = async (notificationId) => {
    const noti = await Notification.findOne({
        where: { notification_id: notificationId },
        include: { model: User }
    });
    if (!noti) throw new Error("Không tìm thấy thông báo");
    return noti;
};

const countUnreadNotifications = async (userId) => {
    return await Notification.count({
        where: { user_id: userId, status: "unread" },
    });
};

const updateNotification = async ({ notification_id, status }) => {
    const noti = await Notification.findOne({ where: { notification_id } });
    if (!noti) throw new Error("Không tìm thấy thông báo");

    noti.status = status;
    await noti.save();

    return "Cập nhật thành công";
};

module.exports = {
    getAllNotification,
    getAllByUserId,
    getById,
    countUnreadNotifications,
    updateNotification,
    createNotification,
    sendNotificationByAction
};
