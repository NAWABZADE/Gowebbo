const express = require("express");
const { signup, login } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { loginSchema, registerSchema } = require("../middleware/validation");

const router = express.Router();

router.post("/signup",validateRequest(registerSchema), signup);
router.post("/login",validateRequest(loginSchema), login);

module.exports = router;
