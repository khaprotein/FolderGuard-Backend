const express = require("express")

const departmentController = require('../controller/departmentController');
const { protectRoute } = require('../middleware/middleware');

const router = express.Router();

router.get("/all",protectRoute,departmentController.getAll);
router.get("/company/:company_id",protectRoute,departmentController.getByCompany)
router.get("/:department_id",protectRoute,departmentController.getById)


router.post("/add",protectRoute,departmentController.add)
router.put("/update/",protectRoute,departmentController.update)
router.delete("/remove/:department_id",protectRoute,departmentController.remove)

module.exports = router;