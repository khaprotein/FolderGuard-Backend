const jwt = require('jsonwebtoken');

const generateToken = (user_id, res) => {
    if (!process.env.JWT_SECRET) {
        throw new Error(" Lỗi: Chưa thiết lập biến môi trường JWT_SECRET_KEY");
    }

    // Tạo token
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Lưu token vào cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        httpOnly: true, // Bảo vệ khỏi JavaScript trên trình duyệt
        sameSite: "strict", // Ngăn CSRF
        secure: process.env.NODE_ENV === "production", // HTTPS ở production
        path: "/", // Cho phép gửi cookie với mọi request
    });

    return token;
};

module.exports = { generateToken };
