const fetch = require('node-fetch')
const express = require("express");
const bodyParser = require('body-parser')
const multer = require('multer')
const uploadDoc = require('../config/gcp-helpers')
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Profile = require('../models/Profile')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const applications_api = 'http://application:5001/application/'
const applicant_details_api = 'http://applicant:5000/applicant_details/id/'

// @desc    View dashboard of applications
// @route   GET /applications/index
router.get("/", ensureAuth, async (req, res) => {
  try {
    const userId = req.user.id
    const settings = {
      method: 'GET'
    };
    const userProfileExists = await fetch(applicant_details_api.concat(userId), settings) 
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

// Multer configs
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

router.use(multerMid.single('file'))

// Post file in application to Google Cloud Storage
router.post('/apply', async (req, res, next) => {
  try {
    console.log('CONNECTED TO POST APPLY IN ROUTER')
    const myFile = req.file
    const userid = req.user.id
    console.log(myFile, userid)
    const docUrl = await uploadDoc(myFile, userid)
    res.status(200)
  } catch (error) {
    next(error)
  }
})

module.exports = router;