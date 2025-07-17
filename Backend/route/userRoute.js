const express = require("express");
const userController = require("../controller/userController");

const { protectRoute } = require("../middleware/middleware");
const router = express.Router();

// Get all users
router.get("/all", protectRoute, userController.getAllUsers);

// Get all users
router.get("/company/:company_id", protectRoute, userController.getByCompany);

// Get user by ID
router.get("/:user_id", protectRoute, userController.findUserById);

// Get user by PUID
router.get("/puid/:puid", protectRoute, userController.findUserByPUID);

// Search users by keyword (full_name or puid)
router.get("/search", protectRoute, userController.searchUsers);

// Create new user
router.post("/add", protectRoute, userController.addUser);

// Update user
router.put("/update", protectRoute, userController.updateUser);

// Delete user
router.delete("/delete/:user_id", protectRoute, userController.deleteUser);

module.exports = router;
