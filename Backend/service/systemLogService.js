const SystemLog = require("../model/SystemLogModel");
const User = require("../model/userModel");
const Company = require("../model/companyModel");
const Department = require("../model/departmentModel");


const getAllSystemLogByCompany = async (company_id) => {
    return await SystemLog.findAll({
        where: { company_id },
        include: [
            {
                model: User,
            },
            {
                model: Department,
            },
            {
                model: Company,
            }
        ]
    });
}

const getSystemLogByID = async (target_id) => {
    return await SystemLog.findAll({where:{target_id:target_id},
        include: [
            {
                model: User,
            },
            {
                model: Company,
            },
            {
                model: Department,
            }
        ]
    });
}

const addSystemLog = async (data) => {
    console.log("")
    const log = await SystemLog.create(data);
    return log;
}

module.exports = {
    getAllSystemLogByCompany,
    getSystemLogByID,
    addSystemLog
};




