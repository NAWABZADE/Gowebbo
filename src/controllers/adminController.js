const adminService = require("../services/adminService");

exports.getAllPractices = async (req, res) => {
    try {
        const response = await adminService.getAllPractices();
        res.status(response.status).json(response);
    } catch (error) {
        console.error("Admin Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};
