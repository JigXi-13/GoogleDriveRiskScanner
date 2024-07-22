const express = require("express");
const { handleOAuth2CallBack } = require("../controllers/authControllers");

const router = express.Router();

//@description     Receive the callback from Google's OAuth 2.0 server.
//@route           GET /oauth2callback
//@access          Public
router.get("", handleOAuth2CallBack);

module.exports = router;
