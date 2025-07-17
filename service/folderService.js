const Folder = require("../model/folderModel");
const Department = require("../model/departmentModel");
const Company = require("../model/companyModel");
const User = require("../model/userModel");
const UserDepartment = require("../model/userDepartmentModel");
const { Op } = require("sequelize");
const ApprovalRequest = require('../model/approvalRequestModel');

const getAll = async () => {
  return await Folder.findAll({
    include: [{ model: Department, include: Company }]
  });
};

const get = async (id) => {
  return await Folder.findByPk(id);
};

const getAllByDept = async (deptId) => {
  const folders = await Folder.findAll({
    where: {
      department_id: deptId,
    },
    include: [
      {
        model: Department
      },
      {
        model: User
      }
    ]
  });
  // Map thêm full request
  const withRequests = await Promise.all(
    folders.map(async (folder) => {
      const latestRequest = await ApprovalRequest.findOne({
        where: {
          target_id: folder.folder_id,
          status: ['DRAFT', 'PENDING', 'APPROVED'],
          request_type: ['create_folder', 'update_folder', 'delete_folder']
        },
        order: [['createdAt', 'DESC']]
      });

      return {
        ...folder.toJSON(),
        latestRequest: latestRequest ? latestRequest.toJSON() : null
      };
    })
  );

  return withRequests;
};

const getByName = async (name, parentId, deptId, Id = null) => {
  return await Folder.findOne({
    where: {
      folder_name: name,
      parent_folder_id: parentId || null,
      department_id: deptId,
      ...(Id && { folder_id: { [Op.ne]: Id } })
    }
  });
};

const getByID = async (folder_id) => {
  return await Folder.findByPk(folder_id);
};


const getTreeByCompany = async (companyId) => {
  return await Folder.findAll({
    where: { parent_folder_id: null },
    include: [
      {
        model: Department,
        where: { company_id: companyId }
      },
      {
        model: Folder,
        as: "SubFolders",
        required: false,
        include: [
          { model: Department },
          {
            model: Folder,
            as: "SubFolders",
            required: false,
            include: [{ model: Department }]
          }
        ]
      }
    ]
  });
};

const getAllByCompany = async (companyId) => {
  const folders = await Folder.findAll({
    include: [
      {
        model: Department,
        where: { company_id: companyId }
      },
      {
        model: User
      }
    ]
  });

  // Map thêm full request
  const withRequests = await Promise.all(
    folders.map(async (folder) => {
      const latestRequest = await ApprovalRequest.findOne({
        where: {
          target_id: folder.folder_id,
          status: ['DRAFT', 'PENDING', 'APPROVED'],
          request_type: ['create_folder', 'update_folder', 'delete_folder']
        },
        order: [['createdAt', 'DESC']]
      });

      return {
        ...folder.toJSON(),
        latestRequest: latestRequest ? latestRequest.toJSON() : null
      };
    })
  );

  return withRequests;
};

const getByUser = async (userId, companyId) => {
  const userDepts = await UserDepartment.findAll({
    where: { user_id: userId },
    include: [{ model: Department, where: { company_id: companyId } }]
  });

  const deptIds = userDepts.map(d => d.department_id);

  return await Folder.findAll({
    where: {
      department_id: deptIds,
      parent_folder_id: null
    },
    include: [
      {
        model: Folder,
        as: "SubFolders",
        required: false,
        include: [
          {
            model: Folder,
            as: "SubFolders",
            required: false
          }
        ]
      }
    ]
  });
};

const getByParent = async (parentId) => {
  return await Folder.findAll({
    where: { parent_folder_id: parentId },
    include: Department
  });
};

const create = async (data) => {
  //let level = 1;
  let path = `/${data.folder_name}`;

  if (data.parent_folder_id) {
    const parent = await Folder.findByPk(data.parent_folder_id);
    if (!parent) throw new Error("Parent folder not found.");
    //level = parent.folder_level + 1;
    // if (level > 3) throw new Error("Only 3 levels are supported.");
    path = `${parent.folder_path}/${data.folder_name}`;
  }

  const ts = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(2, 14);
  const id = `${data.department_id}F${data.folder_level}${ts}`;

  const newfolder = await Folder.create({
    folder_id: id,
    folder_name: data.folder_name,
    parent_folder_id: data.parent_folder_id,
    department_id: data.department_id,
    folder_level: data.folder_level,
    folder_path: path,
    is_locked: data.is_locked,
    status: data.status,
    created_by: data.created_by

  });
  return newfolder;
};

const update = async (data) => {
  const folder = await Folder.findByPk(data.folder_id);
  if (!folder) throw new Error("Folder not found.");

  if (data.new_name) {
    let newPath = `/${data.new_name}`;
    if (folder.parent_folder_id) {
      const parent = await Folder.findByPk(folder.parent_folder_id);
      if (parent) {
        newPath = `${parent.folder_path}/${data.new_name}`;
      }
    }

    const oldPath = folder.folder_path;
    folder.folder_name = data.new_name;
    folder.folder_path = newPath;
    folder.status = data.status;
    folder.is_locked = true;
    await folder.save();

    await updateChildrenPath(folder.folder_id, oldPath, newPath);
  } else {
    folder.is_locked = data.is_locked;
    folder.status = data.status;
    await folder.save();
  }

  return folder;
};

const updateChildrenPath = async (parentId, oldPath, newPath) => {
  const children = await Folder.findAll({ where: { parent_folder_id: parentId } });

  for (const child of children) {
    child.folder_path = child.folder_path.replace(oldPath, newPath);
    await child.save();
    await updateChildrenPath(child.folder_id, oldPath, newPath);
  }
};

const remove = async (id) => {
  const folder = await Folder.findByPk(id);
  if (!folder) throw new Error("Folder not found.");

  const subCount = await Folder.count({ where: { parent_folder_id: id } });
  if (subCount > 0) throw new Error("Folder has subfolders. Cannot delete.");

  await folder.destroy();
  return { message: "Deleted successfully." };
};

module.exports = {
  getAll,
  getAllByDept,
  getByID,
  getByName,
  getTreeByCompany,
  getAllByCompany,
  getByUser,
  getByParent,
  create,
  update,
  remove
};
