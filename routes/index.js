const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // destructuring

const restClient = require('superagent-bluebird-promise');
const path = require('path');
const url = require('url');
const util = require('util');
const Promise = require('bluebird');
const _ = require('lodash');
const querystring = require('querystring');
const securityHelper = require('../lib/security/security');
const crypto = require('crypto');
const colors = require('colors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
