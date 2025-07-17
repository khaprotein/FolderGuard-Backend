const express = require("express")

const systemLogController = require('../controller/systemLogController');
const { protectRoute } = require('../middleware/middleware');

const router = express.Router();

router.get("/company/:company_id",protectRoute,systemLogController.getAllByCompany);
router.get("/request/:target_id",protectRoute,systemLogController.getSystemLogByID);
router.post("/add",protectRoute,systemLogController.addSystemLog);

module.exports = router;