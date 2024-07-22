const http = require("http");
const https = require("https");
const url = require("url");
const { google } = require("googleapis");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const dbConfig = {
  host: process.env.DB_CONFIG_HOST,
  user: process.env.DB_CONFIG_USER,
  password: process.env.DB_CONFIG_PWD,
  database: process.env.DB_CONFIG_DATABASE,
};

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
 * To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Access scopes for read-only Drive activity.
const scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"];
/* Global variable that stores user credential in this code example.
 * ACTION ITEM for developers:
 *   Store user's refresh token in your data store if
 *   incorporating this code into your real app.
 *   For more information on handling refresh tokens,
 *   see https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens
 */
let userCredential = null;

async function checkUserExistence(email) {
  console.log("checkUserExistence: ");
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  connection.end();
  return rows.length > 0 ? rows[0] : null;
}

async function saveUserData(formData, refreshToken) {
  if (!formData || !refreshToken) return;
  console.log("Inserting a data: ", refreshToken);
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(
    `INSERT INTO users (firstName, lastName, jobTitle, country, email, isCompanyEnquiry, companyName, phoneNumber, refreshToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      formData?.firstName,
      formData?.lastName,
      formData?.jobTitle,
      formData?.country,
      formData?.email,
      formData?.isCompanyEnquiry,
      formData?.companyName,
      formData?.phoneNumber,
      refreshToken,
    ]
  );
  connection.end();
}

async function fetchFilesMetadata(auth) {
  const drive = google.drive("v3");
  drive.files.list(
    {
      auth: auth,
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    },
    (err1, res1) => {
      if (err1) {
        console.log("The API returned an error: " + err1);
        // res.send("The API returned an error: " + err1);
      }
      const files = res1.data.files;
      return files;
    }
  );
}

async function main() {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.post("/api/", async (req, res) => {
    console.log("here from back: ", req.url, req.body);
    const {
      firstName,
      lastName,
      jobTitle,
      country,
      email,
      isCompanyEnquiry,
      companyName,
      phoneNumber,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !jobTitle ||
      !country ||
      !email ||
      !isCompanyEnquiry ||
      !companyName ||
      !phoneNumber
    ) {
      res.status(400);
      throw new Error("Please Enter all the Fields");
    }

    try {
      // Check if the user is already in the database
      const existingUser = await checkUserExistence(email);
      if (existingUser) {
        // User exists, redirect to dashboard
        // res.redirect("/reportDashboard");
        // const files = await fetchFilesMetadata(oauth2Client);
        const drive = google.drive("v3");
        drive.files.list(
          {
            auth: oauth2Client,
            pageSize: 10,
            fields: "nextPageToken, files(id, name, mimeType, size)",
            q: "mimeType != 'application/vnd.google-apps.folder'",
          },
          (err1, res1) => {
            if (err1) {
              console.log("The API returned an error: " + err1);
              res.send("The API returned an error: " + err1);
            }
            // if (files.length) {
            //   console.log("Files:");
            //   files.map((file) => {
            //     console.log(`${file.name} (${file.id})`);
            //   });
            // } else {
            //   console.log("No files found.");
            // }

            const files = res1.data.files;
            console.log("Files Backend: ", files);

            res.status(200).json({ files });
          }
        );
        // res.status(200).json({ message: "Authenticated User" });
      } else {
        // User does not exist, redirect to get OAuth consent
        req.session.formData = req.body;

        // res.redirect("/api/registration/");
        console.log("route: /api/registration/ ");
        // Generate a secure random state value.
        const state = crypto.randomBytes(32).toString("hex");
        // Store state in the session
        req.session.state = state;

        // Generate a url that asks permissions for the Drive activity scope
        const authorizationUrl = oauth2Client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: "offline",
          /** Pass in the scopes array defined above.
           * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
          scope: scopes,
          // Enable incremental authorization. Recommended as a best practice.
          include_granted_scopes: true,
          // Include the state parameter to reduce the risk of CSRF attacks.
          state: state,
        });

        console.log("Authorization URL: ", authorizationUrl);
        // res.redirect(authorizationUrl);
        res.json({ authorizationUrl });
      }
    } catch (error) {
      console.error("Error processing the request: ", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Example on redirecting user to Google's OAuth 2.0 server.
  app.get("/api/registration/", async (req, res) => {
    console.log("route: /api/registration/ ");
    console.log("Existing User1: ", req.session);
    // Generate a secure random state value.
    const state = crypto.randomBytes(32).toString("hex");
    // Store state in the session
    req.session.state = state;

    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
      // Include the state parameter to reduce the risk of CSRF attacks.
      state: state,
    });

    res.redirect(authorizationUrl);
  });

  // Receive the callback from Google's OAuth 2.0 server.
  app.get("/oauth2callback", async (req, res) => {
    console.log("route: /oauth2callback ");
    // Handle the OAuth 2.0 server response
    let q = url.parse(req.url, true).query;

    if (q.error) {
      // An error response e.g. error=access_denied
      console.log("Error:" + q.error);
      res.send("Error: " + q.error);
    } else if (q.state !== req.session.state) {
      //check state value
      console.log("State mismatch. Possible CSRF attack");
      res.send("State mismatch. Possible CSRF attack");
    } else {
      // Get access and refresh tokens (if access_type is offline)
      let { tokens } = await oauth2Client.getToken(q.code);
      oauth2Client.setCredentials(tokens);

      /** Save credential to the global variable in case access token was refreshed.
       * ACTION ITEM: In a production app, you likely want to save the refresh token
       *              in a secure persistent database instead. */
      userCredential = tokens;

      req.session.access_token = tokens?.access_token;

      console.log("Before saving User to DB: ", req.session);
      await saveUserData(req.session.formData, tokens.refresh_token);

      res.redirect("http://localhost:3000/reportDashboard");

      //   res.status(200).json({ message: "Registration Successful..." });

      // Redirect to the dashboard
      //   res.redirect("/reportDashboard");
      //   const files = await fetchFilesMetadata(oauth2Client);

      //   res.status(200).json({ files });

      // Example of using Google Drive API to list filenames in user's Drive.
      //   const drive = google.drive("v3");
      //   drive.files.list(
      //     {
      //       auth: oauth2Client,
      //       pageSize: 10,
      //       fields: "nextPageToken, files(id, name)",
      //     },
      //     (err1, res1) => {
      //       if (err1) {
      //         console.log("The API returned an error: " + err1);
      //         res.send("The API returned an error: " + err1);
      //       }
      //       const files = res1.data.files;
      //       if (files.length) {
      //         console.log("Files:");
      //         files.map((file) => {
      //           console.log(`${file.name} (${file.id})`);
      //         });
      //       } else {
      //         console.log("No files found.");
      //       }
      //       res.send("Authentication successful. Check console for files.");
      //     }
      //   );
    }
  });

  //   Example on revoking a token
  app.get("/revoke", async (req, res) => {
    // Build the string for the POST request
    let postData = "token=" + userCredential.access_token;

    // Options for POST request to Google's OAuth 2.0 server to revoke a token
    let postOptions = {
      host: "oauth2.googleapis.com",
      port: "443",
      path: "/revoke",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    // Set up the request
    const postReq = https.request(postOptions, function (res) {
      res.setEncoding("utf8");
      res.on("data", (d) => {
        console.log("Response: " + d);
      });
    });

    postReq.on("error", (error) => {
      console.log(error);
    });

    // Post the request with data
    postReq.write(postData);
    postReq.end();

    res.send("Successfully revoked tokens!");
  });

  app.get("/reportDashboard", async (req, res) => {
    // if (!req.session.accessToken) {
    //   res.status(400);
    //   throw new Error("User not authenticated");
    // }
    // Placeholder route for the user's dashboard
    // res.send("Welcome to your report dashboard!");

    console.log("/reportDashboard");
    // const files = await fetchFilesMetadata(oauth2Client);
    const drive = google.drive("v3");
    drive.files.list(
      {
        auth: oauth2Client,
        pageSize: 10,
        fields:
          "nextPageToken, files(id, name, mimeType, size, quotaBytesUsed, webViewLink)",
        q: "mimeType != 'application/vnd.google-apps.folder'",
      },
      (err1, res1) => {
        if (err1) {
          console.log("The API returned an error: " + err1);
          res.send("The API returned an error: " + err1);
        }
        // if (files.length) {
        //   console.log("Files:");
        //   files.map((file) => {
        //     console.log(`${file.name} (${file.id})`);
        //   });
        // } else {
        //   console.log("No files found.");
        // }

        const files = res1.data.files;
        console.log("Files Backend: ", files);

        res.status(200).json({ files });
        // const files = res1.data.files.map((file) => ({
        //   id: file.id,
        //   fileName: file.name,
        //   fileType: MIME_TYPE_MAP[file.mimeType] || "Unknown",
        //   fileSize: file.size
        //     ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
        //     : "Unknown",
        //   storageUsed: file.quotaBytesUsed
        //     ? (file.quotaBytesUsed / (1024 * 1024)).toFixed(2) + " MB"
        //     : "Unknown",
        //   riskCounter: 0,
        //   fileLink: file.webViewLink,
        // }));
      }
    );
    // res.status(200).json({ files });
  });

  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}
main().catch(console.error);
