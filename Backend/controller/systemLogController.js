const logService = require("../service/systemLogService");

const getAllByCompany = async (req, res) => {
    try {
        const list = await logService.getAllSystemLogByCompany(req.params.company_id);
        res.status(200).json({ list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSystemLogByID = async (req, res) => {
    try {
        const list = await logService.getSystemLogByID(req.params.target_id);
        res.status(200).json({ list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addSystemLog = async (req, res) => {
    try {
        console.log("log:" ,req.body)
        const list = await logService.addSystemLog(req.body.data);
        res.status(200).json({ list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getSystemLogByID,
    addSystemLog,
    getAllByCompany
}