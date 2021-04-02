const fetch = require('node-fetch')
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "9";

const applications_uni_api = 'http://application:5001/application/'

// @desc    View dashboard for university admins
// @route   GET /admin/:university
router.get("/:university", async (req, res) => {
    const university = req.params.university
    const settings = {
        method: 'GET'
    };
    try {
        const fetchResponse = await fetch(applications_uni_api.concat(university), settings);
        const applications = await fetchResponse.json();
        res.render("admin/index", {
          layout: "admin",
          university,
          applications
        });
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
      
})

module.exports = router;
