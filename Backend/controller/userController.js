const userService = require('../service/userService');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getByCompany = async (req, res) => {
  try {
    const users = await userService.getByCompany(req.params.company_id);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findUserById = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findUserByPUID = async (req, res) => {
  try {
    const { puid } = req.params;
    const user = await userService.findUserByPUID(puid);
    if (!user) {
      return res.status(404).json({ message: "User not found with provided PUID" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Missing keyword parameter" });
    }

    const list = await userService.searchUsers(keyword);
    if (!list || list.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const user = await userService.addUser(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const updatedUser = await userService.updateUser(user_id, req.body);
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await userService.deleteUser(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getByCompany,
  findUserById,
  findUserByPUID,
  searchUsers,
  addUser,
  updateUser,
  deleteUser
};
