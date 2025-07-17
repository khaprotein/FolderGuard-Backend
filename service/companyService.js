const Company = require("../model/companyModel");
const { Op } = require("sequelize");

const getAllCompany = async () => {
  const list = await Company.findAll();
  return list;
};

const getCompanyById = async (company_id) => {
  const company = await Company.findByPk(company_id);
  if (!company) {
    throw new Error("Company not found");
  }
  return company;
};

const addCompany = async (data) => {
  const existing = await Company.findOne({
    where: {
      [Op.or]: [
        { company_name: data.name },
        { company_code: data.code }
      ]
    }
  });

  if (existing) {
    throw new Error("Company already exists");
  }

  const company = await Company.create({
    company_name: data.name,
    company_code: data.code,
    description: data.description
  });

  return company;
};

const updateCompany = async (data) => {
  const existing = await Company.findOne({
    where: {
      company_name: data.newName,
      company_id: { [Op.ne]: data.company_id }
    }
  });

  if (existing) {
    throw new Error("Company name already in use");
  }

  const company = await Company.findByPk(data.company_id);
  if (!company) {
    throw new Error("Company not found");
  }

  company.company_name = data.newName;
  company.company_code = data.code;
  company.description = data.description;
  await company.save();

  return company;
};

const deleteCompany = async (company_id) => {
  const company = await Company.findByPk(company_id);
  if (!company) {
    throw new Error("Company not found");
  }

  await company.destroy();
  return { message: "Company deleted successfully" };
};

module.exports = {
  getAllCompany,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany
};
