const express = require("express");
const { logoutUser } = require("../controllers/logoutControllers");

const router = express.Router();

//@description     Logout User or Revoke API Access
//@route           GET /revoke
//@access          Public
router.get("", logoutUser);

module.exports = router;
