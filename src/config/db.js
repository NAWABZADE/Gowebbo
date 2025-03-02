const { Pool } = require("pg");
require("dotenv").config();

// Master DB connection
const masterPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // Master DB
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Store connections for practice databases
const dbPools = {};

async function getDbConnection(practiceDbName) {
  if (!dbPools[practiceDbName]) {
    dbPools[practiceDbName] = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: practiceDbName,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });
  }
  return dbPools[practiceDbName];
}

module.exports = { masterPool, getDbConnection };
