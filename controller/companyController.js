const companyService = require("../service/companyService");

// Get all companies
const getAllCompany = async (req, res) => {
  try {
    const list = await companyService.getAllCompany();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get company by ID
const getCompanyById = async (req, res) => {
  try {
    const { company_id } = req.params;
    const company = await companyService.getCompanyById(company_id);
    res.status(200).json({ company });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

// Add new company
const addCompany = async (req, res) => {
  try {
    const company = await companyService.addCompany(req.body);
    res.status(200).json({ message: "Company added successfully", company });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update existing company
const updateCompany = async (req, res) => {
  try {
    const company = await companyService.updateCompany(req.body);
    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete company by ID
const deleteCompany = async (req, res) => {
  try {
    const { company_id } = req.params;
    await companyService.deleteCompany(company_id);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllCompany,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany
};
