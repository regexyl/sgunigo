const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Profile = require('../models/Profile')

// @desc    View dashboard of applications
// @route   GET /applications/index
router.get("/", ensureAuth, async (req, res) => {
  const userProfileExists = await Profile.exists({ user: req.user.id }) // exists: returns boolean
  try {
    res.render("applications", {
      layout: "main_session",
      name: req.user.firstName,
      userProfileExists
    });
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
});

// @desc    Application form
// @route   GET /applications/apply
router.get("/apply", ensureAuth, async (req, res) => {
  try {
    res.render("applications/apply", {
      name: req.user.firstName,
      layout: "main_session"
    });
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
});

// @desc    Show payment summary
// @route   GET /applications/payment
router.get("/payment", ensureAuth, async (req, res) => {
  try {
    res.render("applications/payment", {
      name: req.user.firstName,
      layout: "main_session"
    });
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
});

// @desc    Paypal API
// @route   GET /applications/paypal
router.get("/paypal", ensureAuth, async (req, res) => {
  try {
    res.render("applications/paypal", {
      name: req.user.firstName,
      layout: "main_session"
    });
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
});

module.exports = router;