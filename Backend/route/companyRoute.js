const express = require("express")

const  companyController = require('../controller/companyController');
const { protectRoute } = require('../middleware/middleware');

const router = express.Router();

router.get("/all",protectRoute,companyController.getAllCompany);
router.get("/:company_id",protectRoute,companyController.getCompanyById)
router.post("/add",protectRoute,companyController.addCompany)
router.put("/update",protectRoute,companyController.updateCompany)
router.delete("/delete/:company_id",protectRoute,companyController.deleteCompany)

module.exports = router;