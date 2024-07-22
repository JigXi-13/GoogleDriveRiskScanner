const express = require("express");
const crypto = require("crypto");

const { checkUserExistence } = require("../controllers/userControllers");
const { oauth2Client, scopes } = require("../config/oauthConfig");

const router = express.Router();

router.post("/", async (req, res) => {
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
    // Generate authorizationUrl & redirect to get OAuth consent
    req.session.formData = req.body;

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

    res.json({ authorizationUrl });
  } catch (error) {
    console.error("Error processing the request: ", error);
    res.status(500).send("Internal Server Error");
  }
});

//@description     Test Backend routing for registration
//@route           GET /registration/
//@access          Public
router.get("/registration/", async (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");
  req.session.state = state;
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state: state,
  });

  res.redirect(authorizationUrl);
});

module.exports = router;
