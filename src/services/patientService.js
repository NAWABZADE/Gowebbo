exports.addPatient = async (practiceDb, { name, age, mobile }) => {
    if (!name || !age) {
        return { success: false, status: 400, message: "Name and age are required." };
    }

    const result = await practiceDb.query("INSERT INTO patients (name, age,mobile) VALUES ($1, $2,$3)", [name, age, mobile]);

    if (result) {
        return { success: true, status: 201, message: "Patient added successfully!" };
    }

    return { success: false, status: 500, message: "Failed to add patient." };
};


exports.getPatients = async (practiceDb) => {
    const { rows } = await practiceDb.query("SELECT * FROM patients WHERE is_deleted = 0");

    if (rows.length > 0) {
        return { success: true, status: 200, message: "Patients fetched successfully!", result: rows };
    }

    return { success: true, status: 404, message: "No active patients found. Either no patients exist or all have been deleted.", result: {} };
};




exports.deletePatient = async (practiceDb, patientId) => {
    if (!patientId) {
        return { success: false, status: 400, message: "Patient ID is required.", result: {} };
    }

    const result = await practiceDb.query(
        "UPDATE patients SET is_deleted = 1 WHERE id = $1 AND is_deleted = 0 RETURNING *",
        [patientId]
    );

    if (result.rowCount > 0) {
        return { success: 1, status: 200, message: "Patient marked as deleted successfully!" };
    }

    return { success: false, status: 404, message: "Patient not found or already deleted." };
};



