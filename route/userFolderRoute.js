const express = require("express");
const UFPermissionController = require("../controller/UFPermissionController");
const { protectRoute } = require('../middleware/middleware');
const router = express.Router();


router.get('/all', protectRoute,UFPermissionController.getAll);

router.get('/folder/:folder_id', protectRoute,UFPermissionController.getByFolder);

router.get('/detail/:permission_id', protectRoute,UFPermissionController.getById);

router.post('/add', protectRoute,UFPermissionController.addByAdmin);

router.put('/update/', protectRoute, UFPermissionController.updateByAdmin );

router.delete('/delete/:permission_id',protectRoute,UFPermissionController.removeByAdmin);

module.exports = router;
