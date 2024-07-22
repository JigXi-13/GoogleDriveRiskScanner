const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"];

module.exports = { oauth2Client, scopes };
