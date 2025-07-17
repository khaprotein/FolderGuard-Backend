const User = require("../model/userModel");
const {Department} = require("../model/index");
const UserDepartment = require("../model/userDepartmentModel");
const {generateToken}  = require('../lib/untils')

// Đăng nhập
const login = async (req, res) => {
  try {
    const { puid, password } = req.body;
    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ where: { puid: puid.trim() ,password} });
    if (!user) {
      return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ!" });
    }

    generateToken(user.user_id,res);

    res.status(200).json({user});

  } catch (error) {
    console.error('Error login out:', error);
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
      res.cookie("jwt","",{maxAge: 0})
      res.status(200).json({message: "Bạn đã đăng xuất!"});
  } catch (error) {
      console.error('Error logout out:', error);
      res.status(500).json({ error: error.message });
  }
};

const checkAuth =  async (req, res) => {
        
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    }
    const info = await User.findOne({
      where: { user_id: user.user_id },
      include:{
              model: UserDepartment,
              include:{
                model: Department
              }
          },

  });
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({info});
  } catch (error) {
      console.error('Error is checkAuth user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = { login, logout , checkAuth};
