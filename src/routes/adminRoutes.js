const express = require("express");
const adminController = require("../controllers/adminController");
const { basicAuth } = require("../middleware/authMiddleware");


const router = express.Router();

// Admin route to get all practices
router.get("/admin/practices", basicAuth, adminController.getAllPractices);

module.exports = router;
