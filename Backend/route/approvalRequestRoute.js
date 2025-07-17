const express = require("express");
const approvalRequestController = require("../controller/approvalRequestController");

const { protectRoute } = require('../middleware/middleware');

const router = express.Router();

router.get("/all", protectRoute,approvalRequestController.getAll);
router.get("/user/:user_id",protectRoute, approvalRequestController.getByUser);
router.get("/department/:department_id", protectRoute,approvalRequestController.getByDepartment);
router.get("/session/:session_id",protectRoute, approvalRequestController.getbysession);
router.post("/create", protectRoute,approvalRequestController.create);
router.put("/update", protectRoute,approvalRequestController.update);
router.delete("/remove/:request_id", protectRoute,approvalRequestController.remove);

module.exports = router;
