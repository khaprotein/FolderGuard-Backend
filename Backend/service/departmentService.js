const Company = require("../model/companyModel");
const Department = require("../model/departmentModel");

const getAll = async () => {
  return await Department.findAll({ include: Company });
};

const getById = async (id) => {
  const dept = await Department.findByPk(id);
  if (!dept) throw new Error("Department not found");
  return dept;
};

const getByCompany = async (companyId) => {
  return await Department.findAll({ where: { company_id: companyId } });
};

const add = async (data) => {
  const exists = await Department.findOne({
    where: { department_name: data.department_name, company_id: data.company_id},
  });
  if (exists) throw new Error("Department already exists");

  return await Department.create({
    company_id: data.company_id,
    department_name: data.department_name,
    department_code: data.department_code,
    description:data.description
  });
};

const update = async (data) => {
  const exists = await Department.findOne({
    where: { department_name: data.newName },
  });
  if (exists) throw new Error("Department name already in use");

  const dept = await Department.findByPk(data.department_id);
  if (!dept) throw new Error("Department not found");

  dept.department_name = data.newName;
  await dept.save();
  return dept;
};

const remove = async (id) => {
  const dept = await Department.findByPk(id);
  if (!dept) throw new Error("Department not found");
  await dept.destroy();
  return { message: "Department deleted successfully" };
};

module.exports = {
  getAll,
  getById,
  getByCompany,
  add,
  update,
  remove,
};
