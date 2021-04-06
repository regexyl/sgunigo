const fetch = require('node-fetch')
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
// const constants = require("../middleware/config");

dotenv.config({ path: `../config/${process.env.NODE_ENV}.env` });

console.log('IP address HERERERERERERERERERERE');

console.log(`IP address: ${process.env.IP_ADDRESS}`);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const applications_api = (process.env.IP_ADDRESS).concat(':8000/application/');

// @desc    View dashboard for university admins
// @route   GET /admin/:university
router.get("/:university", async (req, res) => {
    const university = req.params.university
    const settings = {
        method: 'GET'
    };
    try {
        const fetchResponse = await fetch(applications_api.concat(university).concat('?apikey=').concat(process.env.API_KEY_ADMIN), settings);
        // const fetchResponse = await fetch('http://192.168.137.172.:8000/application/nus?apikey=auo7YwJWqPspBa3YUn0jk5WSZNErdQFH', settings);
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
