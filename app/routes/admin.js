const { request } = require("express");
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const applications_uni_api = 'http://localhost:5001/'

// @desc    View dashboard for university admins
// @route   GET /admin/:university
router.get("/:university", async (req, res) => {
    const university = req.params.university
    request(applications_uni_api.concat(university), {json: true}, (error, res, body) => {
      if (error) {
        return console.log(error)
      }
      if (!error && res.statusCode == 200) {
        const data = body
        console.log(data)
        return data
      }
    })
    try {
      res.render("admin/index", {
        layout: "admin",
        university,
        data
      });
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
});

module.exports = router;
