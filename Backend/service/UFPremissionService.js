const UFPermission = require("../model/userFolderPermissionModel");
const User = require("../model/userModel");
const Folder = require("../model/folderModel");
const Department = require("../model/departmentModel");
const Company = require("../model/companyModel");

const folderService = require("../service/folderService");

const ApprovalRequest = require("../model/approvalRequestModel");

const getAll = async () => {
  const list = await UFPermission.findAll(
  );
  if (!list) throw new Error("Empty list");
  return list;
};

const getByFolder = async (folder_id) => {

  const permissions = await UFPermission.findAll({
    where: { folder_id },
    include: [
      { model: User,as:"User" },
      { model: User,as:"Created_by" },
      {
        model: Folder,
        include: {
          model: Department,
          include: {
            model: Company
          }
        }
      }
    ]
  });

  // Map thêm full request
  const withRequests = await Promise.all(
    permissions.map(async (permission) => {
      const latestRequest = await ApprovalRequest.findOne({
        where: {
          target_id: permission.permission_id,
          status: ['DRAFT', 'PENDING', 'APPROVED'],
          request_type: ['create_permission', 'update_permission', 'delete_permission']
        },
        order: [['createdAt', 'DESC']]
      });

      return {
        ...permission.toJSON(),
        latestRequest: latestRequest ? latestRequest.toJSON() : null
      };
    })
  );

  return withRequests;
};

const getById = async (id) => {
  const p = await UFPermission.findByPk(id, {
    include: [User, Folder]
  });
  if (!p) throw new Error("Permission not found");
  return p;
};


const add = async (data) => {
  const user = await User.findByPk(data.user_id);
  const folder = await folderService.getByID(data.folder_id);
  if (!user || !folder) throw new Error("User or Folder not found");

  const alreadyExists = await UFPermission.findOne({
    where: { user_id: user.user_id, folder_id: folder.folder_id }
  });
  if (alreadyExists) throw new Error("Permission already exists");

  const now = new Date();
  const ts = now.toISOString().replace(/[-:.TZ]/g, "").slice(2, 14);
  const rand = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  const permission_id = `${folder.folder_name}${data.access_level}_${ts}${rand}`;

 const newpermission=  await UFPermission.create({
    permission_id,
    user_id: user.user_id,
    folder_id: folder.folder_id,
    access_level: data.access_level,
    status: data.status,
    created_by: data.created_by
  });

  return newpermission;
};

const update = async (data) => {
  if (!data.permission_id) {
    throw new Error("Missing permission_id");
  }

  const permission = await UFPermission.findByPk(data.permission_id);
  if (!permission) {
    throw new Error("Permission not found");
  }

  const fieldsToUpdate = ['access_level', 'status'];

  fieldsToUpdate.forEach(field => {
    if (data[field] !== undefined) {
      permission[field] = data[field];
    }
  });

  await permission.save();
  return permission;
};


const remove = async (id) => {
  const p = await UFPermission.findByPk(id);
  if (!p) throw new Error("Permission not found");
  await p.destroy();
  return { message: "Deleted successfully." };
};

module.exports = {
  getAll,
  getByFolder,
  getById,
  add,
  update,
  remove
};
