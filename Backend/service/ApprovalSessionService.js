const { Op } = require("sequelize");
const ApprovalSession = require("../model/approvalSessionModel");
const ApprovalRequest = require("../model/approvalRequestModel");
const Department = require("../model/departmentModel");
const User = require("../model/userModel");

const userService = require("./userService");
const Company = require("../model/companyModel");
const Folder = require("../model/folderModel");

// Tạo session mới
const create = async (data) => {
    const user = await userService.findUserById(data.created_by);

    const code = { FOLDER_MANAGEMENT: "FM", USER_PERMISSION: "UP" }[data.session_type];
    const time = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(2, 14);
    const session_id = `${user.puid}${code}${time}`;

    return await ApprovalSession.create({
        session_id,
        created_by: data.created_by,
        company_id:data.company_id,
        department_id: data.department_id,
        session_type: data.session_type,
        status: "DRAFT"
    });
};

const update = async (data) => {
  const session = await ApprovalSession.findByPk(data.session_id);

  if (!session) {
    throw new Error('Session không tồn tại');
  }

  session.status = data.status;
  
  // Nếu có `approved_by` và `approved_at` thì gán luôn:
  if (data.approved_by) {
    session.approved_by = data.approved_by;
    session.approved_at = new Date();
  }

  await session.save();

  return session;
};

const deleteSession = async (session_id) => {
  try {
    
    const deleted = await ApprovalSession.destroy({ where: { session_id } });
    if (deleted === 0) {
      throw new Error('Session not found or already deleted.');
    }
    return true;
  } catch (err) {
    console.error('Failed to delete session:', err.message);
    throw err;
  }
};


// Lấy session theo ID (có include)
const getById = async (session_id) => {
    return await ApprovalSession.findByPk(session_id, {
        include: [
            { model: ApprovalRequest },
            { model: User, as: "Requester" },
            { model: User, as: "Approver" },
            {
                model: Department,
                include: {
                    model: Company
                }
            }
        ]
    });
};

// Lấy tất cả session (tùy lọc theo status)
const getAll = async () => {
    return await ApprovalSession.findAll({
        include: [
            { model: ApprovalRequest,
                include:[
                 { model: User, as: "Requester" },
            { model: User, as: "Approver" },
            ]
             },
            { model: User, as: "Requester" },
            { model: User, as: "Approver" },
            {
                model: Department,
                include: {
                    model: Company
                }
            }
        ]
    });
};

// Lấy tất cả session (tùy lọc theo status)
const getbycompany = async (company_id) => {
    return await ApprovalSession.findAll({
        where:{company_id},
        include: [
            { model: ApprovalRequest },
            { model: User, as: "Requester" },
            { model: User, as: "Approver" },
            {
                model: Department,
                include: {
                    model: Company
                }
            }
        ]
    });
};

const getbydept = async (department_id) => {
    return await ApprovalSession.findAll({where:{department_id},
        include: [
            { model: ApprovalRequest, include:[
                 { model: User, as: "Requester" },
            { model: User, as: "Approver" },
            ] },
            { model: User, as: "Requester" },
            { model: User, as: "Approver" },
            {
                model: Department,
                include: {
                    model: Company
                }
            }
        ]
    });
};

const getDraft =  async (created_by, department_id, session_type) => {
    console.log("data:",created_by, department_id, session_type )
    return await ApprovalSession.findOne({
        where: {
            created_by: created_by,
            department_id: department_id,
            session_type: session_type,
            status: "DRAFT"
        },
        include:[
            {model:ApprovalRequest},
            {model:Department},
            {model:User,as: "Requester"},
            {model:User,as: "Approver"},
        ]
    });
};

module.exports = {
    create,
    update,
    deleteSession,
    getById,
    getAll,
    getDraft,
    getbydept,
    getbycompany
};
