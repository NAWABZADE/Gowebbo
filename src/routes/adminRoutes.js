const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Admin route to get all practices
router.get("/admin/practices", adminController.getAllPractices);

module.exports = router;
