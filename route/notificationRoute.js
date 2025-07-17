const express = require("express")

const {getAllByUserId,getAllNotification,getById,createNotification,updateNotification, countUnreadNotifications} = require('../controller/notificationController');


const {protectRoute} = require("../middleware/middleware")

const router = express.Router();

router.get("/getall",protectRoute,getAllNotification);
router.get("/getall/:userId",protectRoute,getAllByUserId);
router.get("/getbyid/:notificationId",protectRoute,getById);
router.post("/add",protectRoute,createNotification)
router.get("/count/:userId",protectRoute,countUnreadNotifications)
router.put("/update",protectRoute,updateNotification)

module.exports = router;