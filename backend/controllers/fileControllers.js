const { google } = require("googleapis");
const { oauth2Client } = require("../config/oauthConfig");

const fetchFilesMetadata = async (req, res) => {
  // User LoggedOut Condition
  if (!req?.session?.access_token) {
    res.status(400);
    throw new Error("User not authenticated");
  }

  const drive = google.drive("v3");
  drive.files.list(
    {
      auth: oauth2Client,
      pageSize: 10,
      fields:
        "nextPageToken, files(id, name, mimeType, size, quotaBytesUsed, webViewLink, shared)",
      q: "mimeType != 'application/vnd.google-apps.folder'",
    },
    (err1, res1) => {
      if (err1) {
        console.log("The API returned an error: " + err1);
        res.send("The API returned an error: " + err1);
      }

      const files = res1?.data?.files;
      console.log("Files Backend: ", files);
      res.status(200).json({ files });
    }
  );
};

module.exports = { fetchFilesMetadata };
