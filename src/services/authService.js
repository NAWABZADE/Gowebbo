const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { masterPool, getDbConnection } = require("../config/db");
const { emailQueue } = require("../helper/queue");


exports.signup = async ({ name, email, password }) => {
    try {
        // ✅ Validate input fields
        if (!name || !email || !password) {
            return { success: false, status: 400, message: "All fields (name, email, password) are required." };
        }

        // ✅ Check if email already exists
        const existingPractice = await masterPool.query("SELECT * FROM practices WHERE email = $1", [email]);
        if (existingPractice.rows.length > 0) {
            return { success: false, status: 400, message: "Email already registered." };
        }

        // ✅ Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);
        const databaseName = `practice_${Date.now()}_db`;

        // ✅ Insert into master DB
        await masterPool.query(
            "INSERT INTO practices (name, email, password, database_name) VALUES ($1, $2, $3, $4)",
            [name, email, hashedPassword, databaseName]
        );

        // ✅ Create practice-specific database
        await masterPool.query(`CREATE DATABASE ${databaseName}`);
        const practiceDb = await getDbConnection(databaseName);

        // ✅ Create `patients` table
        await practiceDb.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
            CREATE TABLE patients (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                mobile TEXT NOT NULL,
                age INTEGER NOT NULL,
                is_deleted SMALLINT DEFAULT 0 CHECK (is_deleted IN (0, 1)),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await emailQueue.add("sendWelcomeEmail", { email, name });

        return { success: true, status: 201, message: "Practice registered successfully!", database: databaseName };

    } catch (error) {
        console.error("Signup Service Error:", error.message);
        return { success: false, status: 500, message: "Internal Server Error. Please try again later." };
    }
};

exports.login = async ({ email, password }) => {
    try {
        // ✅ Validate input fields
        if (!email || !password) {
            return { success: false, status: 400, message: "Email and password are required." };
        }

        // ✅ Check if practice exists
        const { rows } = await masterPool.query("SELECT * FROM practices WHERE email = $1", [email]);
        if (!rows.length) {
            return { success: false, status: 401, message: "Invalid email or password." };
        }

        const practice = rows[0];

        // ✅ Verify password
        const match = await bcrypt.compare(password, practice.password);
        if (!match) {
            return { success: false, status: 401, message: "Invalid email or password.", };
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ database_name: practice.database_name }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRE_IN });

        return { success: true, status: 200, message: "Login successfull!", token };

    } catch (error) {
        console.error("Login Service Error:", error.message);
        return { success: false, status: 500, message: "Internal Server Error. Please try again later." };
    }
};
