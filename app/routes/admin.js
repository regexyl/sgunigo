const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc    View dashboard for university admins
// @route   GET /admin/:university
router.get("/:university", async (req, res) => {
    const university = req.params.university
    try {
      res.render("admin/index", {
        layout: "admin",
        university
      });
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
});

module.exports = router;
