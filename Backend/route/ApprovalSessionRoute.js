const express = require("express");
const ApprovalSessionController = require("../controller/ApprovalSessionController");

const { protectRoute } = require('../middleware/middleware');
const router = express.Router();

router.get("/all", protectRoute, ApprovalSessionController.getAll);
router.get("/draft", protectRoute, ApprovalSessionController.getDraft);
router.get("/department/:department_id", protectRoute, ApprovalSessionController.getbydept);
router.get("/company/:company_id", protectRoute, ApprovalSessionController.getbycompany);
router.get("/:session_id", protectRoute, ApprovalSessionController.getById);

router.post("/create", protectRoute, ApprovalSessionController.create);
router.put("/update", protectRoute, ApprovalSessionController.update);
router.delete("/delete/:session_id", protectRoute, ApprovalSessionController.deleteSession);

module.exports = router;
