const departmentService = require("../service/departmentService");

const getAll = async (req, res) => {
  try {
    const list = await departmentService.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getByCompany = async (req, res) => {
  try {
    const { company_id } = req.params;
    const list = await departmentService.getByCompany(company_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { department_id } = req.params;
    const list = await departmentService.getById(department_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};



const add = async (req, res) => {
  try {

    const department = await departmentService.add(req.body);
    res.status(200).json({ message: "Add department successfully", department });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  try {
    const department = await departmentService.update(req.body);
    res.status(200).json({ message: "Update department successfully", department });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};
const remove = async (req, res) => {
  try {
    const { department_id } = req.params;
    const data = await departmentService.remove(department_id);
    res.status(200).json({ message: "Delete department successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getByCompany,
  getById,
  add,
  update,
  remove
};
