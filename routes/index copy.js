const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // destructuring

// @desc    Home page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("index"); // looks for the index file under views
});

// @desc    Login and landing page
// @route   GET /
router.get("/login", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

module.exports = router;
