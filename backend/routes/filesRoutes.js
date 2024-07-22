const express = require("express");
const { fetchFilesMetadata } = require("../controllers/fileControllers");

const router = express.Router();

//@description     Get file analysis
//@route           GET /reportDashboard
//@access          Public
router.get("", fetchFilesMetadata);

module.exports = router;
