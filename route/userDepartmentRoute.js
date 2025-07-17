const express = require("express");
const controller = require("../controller/userDepartmentController");
const { protectRoute } = require("../middleware/middleware");

const router = express.Router();

router.get("/all", protectRoute, controller.getAll);

router.get("/user/:user_id", protectRoute, controller.getByUser);

router.get("/department/:department_id", protectRoute, controller.getByDepartment);

router.get("/company/:company_id/user/:user_id", protectRoute, controller.getInCompany);

router.post("/add", protectRoute, controller.add);

router.put("/update", protectRoute, controller.update);

router.delete("/delete/:user_department_id", protectRoute, controller.remove);

module.exports = router;
