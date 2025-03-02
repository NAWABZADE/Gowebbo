const express = require("express");
const { addPatient, getPatients, deletePatient } = require("../controllers/patientController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/patients", authenticate, addPatient);
router.get("/patients", authenticate, getPatients);
router.delete("/patients/:id", authenticate, deletePatient);

module.exports = router;
