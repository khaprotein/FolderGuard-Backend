const folderService = require("../service/folderService");
const mailService = require("../service/mailService");

const getAll = async (req, res) => {
    try {
        const list = await folderService.getAll();
        res.status(200).json({ list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const list = await folderService.getAllByCompany(companyId);
        res.status(200).json({ list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTreeByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const folders = await folderService.getTreeByCompany(companyId);
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const list = await folderService.getAllByDept(departmentId);
        res.status(200).json({list});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByParent = async (req, res) => {
    try {
        const { parent_folder_id } = req.params;
        const folders = await folderService.getByParent(parent_folder_id);
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { folder_id } = req.params;
        const folder = await folderService.getByID(folder_id);
        res.status(200).json({ folder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {

        const existed = await folderService.getByName(
            req.body.folder_name,
            req.body.parent_folder_id,
            req.body.department_id
        );

        if (existed) return res.status(409).json({ message: "Folder name already exists" });

        const folder = await folderService.create(req.body);
        return res.status(201).json({ message: "Folder created", folder });
    } catch (error) {
        console.log("err: ".error)
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        console.log("data:", req.body)
        const existed = await folderService.getByName(
            req.body.new_name,
            req.body.parent_folder_id,
            req.body.department_id,
            req.body.folder_id
        );
        
        if (existed) return res.status(409).json({ message: "Folder name already exists" ,existed});

        const folder = await folderService.update(req.body);

        return res.status(201).json({ message: "Folder updated", folder });
    } catch (error) {
        console.log("err: ".error)
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {

        await folderService.remove(req.params.folder_id);

        return res.status(201).json({ message: "Folder removed" });
    } catch (error) {
        console.log("err: ".error)
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getAllByCompany,
    getTreeByCompany,

    getByDepartment,
    getByParent,
    getById,

    create,
    update,
    remove
};
