const fetch = require('node-fetch')
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Profile = require('../models/Profile');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const IP_ADDRESS='http://172.20.10.4'
const API_KEY_APPLICANT='AYuRJuTIMUUfqYAANsTGJlxX8YVkCwTT'


// @desc    View dashboard of applications
// @route   GET /applications/index
router.get("/", ensureAuth, async (req, res) => {
  try {
    const userProfileExists = await Profile.exists({ user: req.user.id }) // exists: returns boolean
    const userId = req.user.id
    const settings = {
        method: 'GET'
    };
      const paidFetchResponse = await fetch(IP_ADDRESS.concat(':8000/application/paid/', userId,'?apikey=',API_KEY_APPLICANT), settings);
      const paidApplications = await paidFetchResponse.json();
      const unpaidFetchResponse = await fetch(IP_ADDRESS.concat(':8000/application/unpaid/', userId,'?apikey=',API_KEY_APPLICANT), settings);
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
    const userId = req.user.id
    const settings = {
      method: 'GET'
    };
    const fetchResponse = await fetch(applicant_details_api.concat(userId), settings)
    const userProfileResponse = await fetchResponse.json()
    const userProfile = userProfileResponse.data
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

module.exports = router;