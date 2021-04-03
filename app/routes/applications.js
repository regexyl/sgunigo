const fetch = require('node-fetch')
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Profile = require('../models/Profile')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const applications_api = 'http://application:5001/application/'

// @desc    View dashboard of applications
// @route   GET /applications/index
router.get("/", ensureAuth, async (req, res) => {
  try {
    const userProfileExists = await Profile.exists({ user: req.user.id }) // exists: returns boolean
    const userId = req.user.id
    const settings = {
        method: 'GET'
    };
      const paidFetchResponse = await fetch(applications_api.concat('paid/', userId), settings);
      const paidApplications = await paidFetchResponse.json();
      const unpaidFetchResponse = await fetch(applications_api.concat('unpaid/', userId), settings);
      const unpaidApplications = await unpaidFetchResponse.json();
      res.render("applications/index", {
        layout: "main_session",
        name: req.user.firstName,
        userProfileExists,
        userId,
        paidApplications,
        unpaidApplications
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
    const userProfile = await Profile.findOne({ user: req.user.id }).lean()
    const userId = req.user.id
    res.render("applications/apply", {
      layout: "apply",
      userProfile,
      userId
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

module.exports = router;