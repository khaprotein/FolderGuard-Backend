
const userFolderService = require("../service/UFPremissionService");

const userService = require("../service/userService");

const folderService = require("../service/folderService");

const departmentService = require("../service/departmentService");

const userDepartmentService = require("../service/userDepartmentService");

const notificationService = require("../service/notificationService");

const approvalRequestService = require("../service/approvalRequestService");
const approvalSessionService = require("../service/approvalSessionService");

const logService = require("../service/systemLogService");


const getAll = async (req, res) => {
  try {
    const list = await userFolderService.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(404).json({ message: error.message });
  }
};

const getByFolder = async (req, res) => {
  try {
    const { folder_id } = req.params;
    const list = await userFolderService.getByFolder(folder_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(404).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { permission_id } = req.params;
    const permission = await userFolderService.getById(permission_id);
    res.status(200).json({permission });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(404).json({ message: error.message });
  }
};

const addByAdmin = async (req, res) => {
  try {
    const permission = await userFolderService.add(req.body);

    return res.status(201).json({ message: "added", permission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateByAdmin = async (req, res) => {
  try {
    const permission = await userFolderService.update(req.body);

    return res.status(201).json({ message: "updated", permission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeByAdmin = async (req, res) => {
  try {

    await userFolderService.remove(req.params.permission_id);

    return res.status(201).json({ message: "removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getByFolder,
  getById,
  addByAdmin,
  updateByAdmin,
  removeByAdmin
};
