const authService = require("../services/authService");

exports.signup = async (req, res) => {
    try {
        const response = await authService.signup(req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error("Signup Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};

exports.login = async (req, res) => {
    try {
        const response = await authService.login(req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error("Login Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};
