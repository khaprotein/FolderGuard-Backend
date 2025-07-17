const userDepartmentService = require("../service/userDepartmentService");

const getAll = async (req, res) => {
  try {
    const list = await userDepartmentService.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const list = await userDepartmentService.getByUser(user_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const getByDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;
    const list = await userDepartmentService.getByDepartment(department_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const getInCompany = async (req, res) => {
  try {
    const { company_id, user_id } = req.params;
    const UD = await userDepartmentService.getInCompany(company_id, user_id);
    res.status(200).json({UD});
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};


const add = async (req, res) => {
  try {
    const { department_id, user_id, role } = req.body;
    const data = await userDepartmentService.add({ department_id, user_id, role });
    res.status(201).json({ message: "User added to department successfully", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { user_department_id, role } = req.body;
    const data = await userDepartmentService.update({ user_department_id, role });
    res.status(200).json({ message: "User role updated successfully", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { user_department_id } = req.params;
    const result = await userDepartmentService.remove(user_department_id);
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getByUser,
  getByDepartment,
  getInCompany,
  add,
  update,
  remove
};
