const Company = require("./companyModel");
const Department = require("./departmentModel");
const User = require("./userModel");
const UserDepartment  = require("./userDepartmentModel")


const Folder = require("./folderModel");
const UFPermission = require("./userFolderPermissionModel");
const ApprovalSession = require("./approvalSessionModel");
const ApprovalRequest = require("./approvalRequestModel");

const SystemLog = require("./SystemLogModel");

const Notification = require("./notificationModel");

const sequelize = require("../lib/dbConfig");

// 1 phòng ban thuộc 1 công ty
Company.hasMany(Department, { foreignKey: "company_id" });
Department.belongsTo(Company, { foreignKey: "company_id" });

//
// 1 user có thể thuộc nhiều phòng ban
User.hasMany(UserDepartment, { foreignKey: "user_id" }); 
UserDepartment.belongsTo(User, { foreignKey: "user_id" }); 

// 1 phòng ban có nhiều user

Department.hasMany(UserDepartment, { foreignKey: "department_id" }); 
UserDepartment.belongsTo(Department, { foreignKey: "department_id" }); 


//quan hệ Folder
// 1 phòng ban có nhiều folder
Department.hasMany(Folder,{foreignKey:"department_id"});
//1 folder thuộc 1 phòng ban
Folder.belongsTo(Department, {foreignKey:"department_id"});
// 1 folder do 1 user tạo
Folder.belongsTo(User, {foreignKey:"created_by"});
// 1 folder có nhiều folder con
Folder.hasMany(Folder, {as: "SubFolders", foreignKey:"parent_folder_id"});



//Quan hệ phân quyền truy cập
// 1 folder có nhiều user truy cập
Folder.hasMany(UFPermission,{foreignKey: "folder_id"});
// mỗi quyền truy cập chỉ thuộc 1 folder
UFPermission.belongsTo(Folder,{foreignKey:"folder_id"});
// 1 quyền chi thuộc 1 user
UFPermission.belongsTo(User, { foreignKey:"user_id", as:"User"});
// 1 quyền sẽ do 1 user tạo
UFPermission.belongsTo(User, { foreignKey:"created_by",as:"Created_by"});




///// SESSION
ApprovalSession.hasMany(ApprovalRequest,{foreignKey:"session_id"})
ApprovalSession.belongsTo(Department,{foreignKey:"department_id"})
ApprovalSession.belongsTo(Company,{foreignKey:"company_id"})
Department.hasMany(ApprovalSession,{foreignKey:"department_id"})

ApprovalSession.belongsTo(User,{foreignKey:"approved_by", as: "Approver"})
User.hasMany(ApprovalSession,{foreignKey:"approved_by", as: "Approver"})

ApprovalSession.belongsTo(User,{foreignKey:"created_by", as: "Requester"})
User.hasMany(ApprovalSession,{foreignKey:"created_by", as: "Requester"})

/// REQUEST
  ApprovalRequest.belongsTo(ApprovalSession, { foreignKey: "session_id" });

  ApprovalRequest.belongsTo(User, { foreignKey: "action_by", as: "Requester" });

  ApprovalRequest.belongsTo(User, { foreignKey: "approved_by", as: "Approver" });
 
///
SystemLog.belongsTo(User, { foreignKey: "action_by" });
SystemLog.belongsTo(Company, { foreignKey: "company_id" });
SystemLog.belongsTo(Department, { foreignKey: "department_id" });

//
Notification.belongsTo(User, { foreignKey: "user_id" });


module.exports = {
  sequelize,
  User,
  Company,
  Department,
  UserDepartment,
  ApprovalRequest,
  ApprovalSession,
  Notification,
  SystemLog,
  Folder,
  UFPermission
};