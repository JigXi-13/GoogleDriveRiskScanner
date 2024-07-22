const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_CONFIG_PWD,
  database: "gdrive_risk_report",
};

const getConnection = async () => {
  return await mysql.createConnection(dbConfig);
};

module.exports = { getConnection };
