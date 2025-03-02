exports.addPatient = async (practiceDb, { name, age }) => {
    // ✅ Validate input fields
    if (!name || !age) {
        return { success: false, status: 400, message: "Name and age are required." };
    }

    // ✅ Insert patient data
    const result = await practiceDb.query("INSERT INTO patients (name, age) VALUES ($1, $2)", [name, age]);

    if (result) {
        return { success: true, status: 201, message: "Patient added successfully!" };
    }

    return { success: false, status: 500, message: "Failed to add patient." };
};


exports.getPatients = async (practiceDb) => {
    const { rows } = await practiceDb.query("SELECT * FROM patients");

    if (rows) {
        let result = {};
        result.data = rows;

        // ✅ Check if any patients exist
        if (rows.length > 0) {
            return { success: true, status: 200, message: "Patients fetched successfully!", result: result };
        }

        return { success: true, status: 204, message: "No patients found.", result: result };
    }

    return { success: false, status: 500, message: "Failed to retrieve patients.", result: {} };
};



exports.deletePatient = async (practiceDb, patientId) => {
    // ✅ Validate ID
    if (!patientId) {
        return { success: false, status: 400, message: "Patient ID is required.", result: {} };
    }

    // ✅ Delete patient
    const result = await practiceDb.query("DELETE FROM patients WHERE id = $1 RETURNING *", [patientId]);

    if (result) {
        let responseResult = {};
        responseResult.data = result.rows;

        // ✅ Check if the patient was deleted (i.e., rowCount > 0)
        if (result.rowCount > 0) {
            return { success: 1, status: 200, message: "Patient deleted successfully!", result: responseResult };
        }

        return { success: true, status: 404, message: "Patient not found or already deleted.", result: responseResult };
    }

    return { success: false, status: 500, message: "Failed to delete patient.", result: {} };
};


