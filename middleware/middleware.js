const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const userService = require('../service/userService');

const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies?.jwt; 
        if (!token) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập! (Không tìm thấy token trong cookie)" });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
  
        const user = await userService.findUserById(decoded.user_id)
        if (!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại!" });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Lỗi trong protectRoute:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

module.exports = { protectRoute };
