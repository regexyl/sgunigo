const fetch = require('node-fetch')
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const dotenv = require("dotenv");
dotenv.config({ path: `./.env` });
IP_ADDRESS=process.env.IP_ADDRESS;
API_KEY_ADMIN=process.env.API_KEY_ADMIN;
console.log(IP_ADDRESS);

const applications_api = IP_ADDRESS.concat('/application/?apikey=').concat(API_KEY_ADMIN);

// @desc    View dashboard for university admins
// @route   GET /admin/:university
router.get("/:university", async (req, res) => {
    const university = req.params.university
    const settings = {
        method: 'GET'
    };
    try {
        const fetchResponse = await fetch(applications_api.concat(university), settings);
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
