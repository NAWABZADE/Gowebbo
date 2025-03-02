const { masterPool } = require("../config/db");

exports.getAllPractices = async () => {
    const query = "SELECT id, name, email FROM practices ORDER BY id ASC";
    
    const query_res = await masterPool.query(query);

    if (query_res) {
        let result = {};
        result.data = query_res.rows;

        if (query_res.rowCount > 0) {
            return { success: 1, status: 200, message: "All practices fetched successfully!", result: result };
        }

        return { success: 1, status: 204, message: "No practices found!", result: result };
    }

    return { success: 0, status: 500, message: "Failed to fetch practices.", result: {} };
};

