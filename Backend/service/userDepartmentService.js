const Company = require("../model/companyModel");
const Department = require("../model/departmentModel");
const UserDepartment = require("../model/userDepartmentModel");
const User = require("../model/userModel");

// Get all mappings
const getAll = async () => {
  return await UserDepartment.findAll({
    include: [
      { model: Department, include: { model: Company } },
      { model: User },
    ],
  });
};

// Get departments by user_id
const getByUser = async (user_id) => {
  const list = await UserDepartment.findAll({
    where: { user_id },
    include: [
      { model: User },
      { model: Department, include: { model: Company } },
    ],
  });

  if (!list || list.length === 0) {
    throw new Error("User is not assigned to any department.");
  }

  return list;
};

// Get users by department_id
const getByDepartment = async (department_id) => {
  return await UserDepartment.findAll({
    where: { department_id },
    include: [{ model: User, include: { model: Company } }],
  });
};

// Get users by department_id
const getOwner = async (department_id) => {
  return await UserDepartment.findOne({
    where: { department_id, role: "Owner" },
    include: [
      { model: User },
      { model: Department },
    ],
  });
};

// Get user-department in specific company
const getInCompany = async (company_id, user_id) => {
  const result = await UserDepartment.findOne({
    where: { user_id },
    include: [
      {
        model: Department,
        where: { company_id },
        include: {
          model: Company
        }
      },
      { model: User }
    ],
  });

  if (!result) {
    throw new Error("User is not in any department of the selected company.");
  }

  return result;
};

// Add user to department
const add = async (data) => {
  const exists = await UserDepartment.findOne({
    where: { department_id: data.department_id, user_id: data.user_id },
  });

  if (exists) {
    throw new Error("User is already in this department.");
  }

  return await UserDepartment.create({
    department_id: data.department_id,
    user_id: data.user_id,
    role: data.role,
  });
};

// Update user's role
const update = async (data) => {
  const record = await UserDepartment.findOne({
    where: { user_department_id: data.user_department_id },
  });

  if (!record) {
    throw new Error("Mapping not found.");
  }

  record.role = data.role;
  await record.save();
  return record;
};

// Remove user from department
const remove = async (user_department_id) => {
  const record = await UserDepartment.findOne({
    where: { user_department_id },
  });

  if (!record) {
    throw new Error("Mapping not found.");
  }

  await record.destroy();
  return { message: "Removed successfully." };
};

module.exports = {
  getAll,
  getByUser,
  getOwner,
  getByDepartment,
  getInCompany,
  add,
  update,
  remove,
};
