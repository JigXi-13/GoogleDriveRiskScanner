const { getConnection } = require("../config/dbConfig");

const checkUserExistence = async (email) => {
  if (!email) return null;
  const connection = await getConnection();
  const [rows] = await connection.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  connection.end();
  return rows.length > 0 ? rows[0] : null;
};

const saveUserData = async (formData, refreshToken) => {
  if (!formData || !refreshToken) return;
  const connection = await getConnection();
  await connection.execute(
    `INSERT INTO users (firstName, lastName, jobTitle, country, email, isCompanyEnquiry, companyName, phoneNumber, refreshToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      formData.firstName,
      formData.lastName,
      formData.jobTitle,
      formData.country,
      formData.email,
      formData.isCompanyEnquiry,
      formData.companyName,
      formData.phoneNumber,
      refreshToken,
    ]
  );
  connection.end();
};

module.exports = { checkUserExistence, saveUserData };
