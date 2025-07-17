const User = require("../model/userModel");
const UserDepartment = require("../model/userDepartmentModel")
const Department = require("../model/departmentModel")
const { Op } = require("sequelize");
const Company = require("../model/companyModel");

const getAll = async () => {
  return await User.findAll();
};

const getByCompany = async (company_id) => {
  return await User.findAll({
    where: { company_id },
    include: {
      model: UserDepartment,
      include: {
        model: Department,
        include: {
          model: Company,
        }
      }
    }
  });
};

const addUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const updateUser = async (user_id, updateData) => {
  const [updatedCount] = await User.update(updateData, {
    where: { user_id },
  });

  if (updatedCount === 0) {
    throw new Error("User not found or no changes applied.");
  }

  const updatedUser = await User.findByPk(user_id);
  return updatedUser;
};

const deleteUser = async (user_id) => {
  const deletedCount = await User.destroy({
    where: { user_id },
  });

  if (deletedCount === 0) {
    throw new Error("User not found.");
  }

  return { message: "User deleted successfully." };
};

// Find user by ID
const findUserById = async (user_id) => {
  const user = await User.findByPk(user_id, {
    include: {
      model: UserDepartment,
      include: {
        model: Department,
        include: {
          model: Company,
        }
      }
    }
  });

  return user;
};

// Find user by PUID
const findUserByPUID = async (puid) => {
  const user = await User.findOne({ where: { puid } });
  return user;
};

// Search user by keyword (name or PUID)
const searchUsers = async (keyword) => {
  return await User.findAll({
    where: {
      [Op.or]: [
        { full_name: { [Op.like]: `%${keyword}%` } },
        { puid: { [Op.like]: `%${keyword}%` } },
      ],
    }
  });
};

module.exports = {
  getAll,
  getByCompany,
  findUserById,
  addUser,
  updateUser,
  deleteUser,
  searchUsers,
  findUserByPUID
};
