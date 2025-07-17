const ApprovalRequest = require("../model/approvalRequestModel");
const User = require("../model/userModel");
const Folder = require("../model/folderModel");
const Department = require("../model/departmentModel");
const ApprovalSession = require("../model/approvalSessionModel");

const folderService = require("../service/folderService");
const ufPermissionService = require("../service/UFPremissionService");

const { Op } = require("sequelize");
const Company = require("../model/companyModel");
const UFPermission = require("../model/userFolderPermissionModel");

// Get all approval requests
const getAll = async () => {
  try {
    return await ApprovalRequest.findAll({
      include: [
        { model: User, as: "Requester" },
        { model: User, as: "Approver" }
      ]
    });
  } catch (err) {
    console.error("Failed to fetch all requests:", err.message);
    throw new Error("Unable to retrieve approval requests.");
  }
};

// Get requests created by a specific user
const getByUser = async (user_id) => {
  try {
    return await ApprovalRequest.findAll({
      where: { action_by: user_id },
      include: [
        { model: User, as: "Requester" },
        { model: User, as: "Approver" }
      ]
    });
  } catch (err) {
    console.error("Failed to fetch user requests:", err.message);
    throw new Error("Unable to retrieve requests by user.");
  }
};

// Get requests created by a specific user
const getDraft = async (user_id) => {
  try {
    return await ApprovalRequest.findAll({
      where: {
        action_by: user_id,
        status: "Draft"
      },
      include: [
        { model: User, as: "Requester" },
        { model: User, as: "Approver" }
      ]
    });
  } catch (err) {
    console.error("Failed to fetch user requests:", err.message);
    throw new Error("Unable to retrieve requests by user.");
  }
};


// Get requests created by a specific user
const getbysession = async (session_id) => {
  try {
    return await ApprovalRequest.findAll({
      where: {
       session_id:session_id
      },
      include: [
        { model: User, as: "Requester" },
        { model: User, as: "Approver" }
      ]
    });
  } catch (err) {
    console.error("Failed to fetch user requests:", err.message);
    throw new Error("Unable to retrieve requests by user.");
  }
};

// Create new request
const create = async (data) => {
  try {
    const request = await ApprovalRequest.create({
      session_id: data.session_id,
      request_type: data.request_type,
      action_by: data.action_by,
      approved_by: null,
      approved_at: null,
      status: data.status,
      target_id: data.target_id,
      request_data: data.request_data,
      description: data.description || null
    });
    return request;
  } catch (err) {
    console.error("Failed to create request:", err.message);
    throw new Error("Unable to create approval request.");
  }
};

const update = async (data) => {
  try {
    const request = await ApprovalRequest.findByPk(data.request_id);
    if (!request) throw new Error("Request not found.");

    await request.update(data);

    const { request_type, target_id, status, request_data } = request;

    if (status === "APPROVED") {
      await applyApprovedChanges(request_type, target_id);
    } else if (status === "REJECTED") {
      await rollbackRejectedChanges(request_type, target_id, request_data);
    } else if (status === "DONE") {
      await finalizeDoneChanges(request_type, target_id, request_data);
    }

    return request;
  } catch (err) {
    console.error("Failed to update request:", err.message);
    throw new Error("Unable to update approval request.");
  }
};

const applyApprovedChanges = async (type, id) => {
  const isFolder = type.includes("folder");
  const isPermission = type.includes("permission");

  if (isFolder) {
    await Folder.update({ status: "APPROVED",is_locked:true }, { where: { folder_id: id } });
  } else if (isPermission) {
    await UFPermission.update({ status: "APPROVED" }, { where: { permission_id: id } });
  }
};

const rollbackRejectedChanges = async (type, id, rawData) => {
  const data = JSON.parse(rawData || "{}");

  switch (type) {
    case "create_folder":
      await Folder.destroy({ where: { folder_id: id } });
      break;
    case "create_permission":
      await UFPermission.destroy({ where: { permission_id: id } });
      break;
    case "update_folder":
      await folderService.update({
        folder_id: id,
        new_name: data.old_folder_name,
        status: null
      });
      break;
    case "delete_folder":
      await Folder.update({ status: null }, { where: { folder_id: id } });
      break;
    case "update_permission":
      await ufPermissionService.update({
        permission_id: id,
        access_level: data.old_access_level,
        status: null
      });
      break;
    case "delete_permission":
      await UFPermission.update({ status: null }, { where: { permission_id: id } });
      break;
  }
};

const finalizeDoneChanges = async (type, id, rawData) => {
  switch (type) {
    case "create_folder":
    case "update_folder":
      await folderService.update({ folder_id: id, status: '' , is_locked: false});
      break;
    case "create_permission":
    case "update_permission":
      await ufPermissionService.update({ permission_id: id, status: '' });
      break;
    case "delete_folder":
      await folderService.remove(id);
      break;
    case "delete_permission":
      await ufPermissionService.remove(id);
      break;
  }
};

const remove = async (request_id) => {
  try {
    const request = await ApprovalRequest.findByPk(request_id);
    if (!request) throw new Error("Request not found.");

    const { request_type, target_id, status, request_data } = request;

    if (status === 'DRAFT') {
      if (request_type === 'create_folder') {
        await Folder.destroy({ where: { folder_id: target_id } });

      } else if (request_type === 'create_permission') {
        await UFPermission.destroy({ where: { permission_id: target_id } });

      } else if (request_type === 'update_folder') {
        const parsedData = JSON.parse(request_data || '{}');
        const data = {
          folder_id: target_id,
          new_name: parsedData.old_name,
          status: ''
        }
        await folderService.update(data)
      } else if (request_type === 'delete_folder') {
        await Folder.update(
          { status: '' },
          { where: { folder_id: target_id } }
        );

      } else if (request_type === 'update_permission') {
        const parsedData = JSON.parse(request_data || '{}');
        const data = {
          permission_id: target_id,
          access_level: parsedData.old_access_level,
          status: ''
        }
        await ufPermissionService.update(data);
      } else if (request_type === 'delete_permission') {
        await UFPermission.update(
          { status: '' },
          { where: { permission_id: target_id } }
        );
      }
    }
    // Delete request record
    await ApprovalRequest.destroy({ where: { request_id } });
    return true;
  } catch (err) {
    console.error("Failed to delete request:", err.message);
    throw new Error(err.message || "Unable to delete approval request.");
  }
};



module.exports = {
  getAll,
  getByUser,
  getDraft,
  getbysession,
  create,
  update,
  remove
};
