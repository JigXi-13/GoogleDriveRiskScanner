const crypto = require("crypto");
const { oauth2Client } = require("../config/oauthConfig");

const url = require("url");
const {
  saveUserData,
  checkUserExistence,
} = require("../controllers/userControllers");

const handleOAuth2CallBack = async (req, res) => {
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

    const existingUser = await checkUserExistence(
      req?.session?.formData?.email
    );
    if (!existingUser) {
      await saveUserData(req.session.formData, tokens.refresh_token);
    }

    res.redirect("http://localhost:3000/reportDashboard");
  }
};

module.exports = { handleOAuth2CallBack };
