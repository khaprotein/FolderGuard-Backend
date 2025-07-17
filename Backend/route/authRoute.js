const express = require("express");
const { login ,logout, checkAuth} = require ("../controller/authController");
const { protectRoute } = require('../middleware/middleware');
const router = express.Router();

router.post("/login", login);
router.post("/logout",logout);
router.get("/check",protectRoute,checkAuth);

module.exports = router;
