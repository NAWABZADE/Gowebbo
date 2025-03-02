const patientService = require("../services/patientService");

exports.addPatient = async (req, res) => {
    try {
        const response = await patientService.addPatient(req.practiceDb, req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error("Add Patient Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};


exports.getPatients = async (req, res) => {
    try {
        const response = await patientService.getPatients(req.practiceDb);
        res.status(response.status).json(response);
    }
    catch (error) {
        console.error("Get Patients Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};


exports.deletePatient = async (req, res) => {
    try {
        const response = await patientService.deletePatient(req.practiceDb, req.params.id);
        res.status(response.status).json(response);
    } catch (error) {
        console.error("Delete Patient Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
    }
};
