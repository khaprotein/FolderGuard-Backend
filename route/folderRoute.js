const express = require("express");
const folderController  = require("../controller/folderController");

const { protectRoute } = require('../middleware/middleware');

const router = express.Router();

router.get('/all', protectRoute, folderController.getAll);

router.get('/company/:companyId/tree', protectRoute, folderController.getTreeByCompany);

router.get('/company/:companyId', protectRoute, folderController.getAllByCompany);

router.get('/department/:departmentId', protectRoute, folderController.getByDepartment);

router.get('/parent/:parent_folder_id', protectRoute, folderController.getByParent);

router.get('/:folder_id', protectRoute, folderController.getById);

router.post('/add', protectRoute, folderController.create);

router.put('/update', protectRoute, folderController.update);

router.delete('/delete/:folder_id', protectRoute, folderController.remove);


module.exports = router;
