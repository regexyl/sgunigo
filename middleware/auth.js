// Purpose: To give users who have logged in access to the applications pages, and restrict those who have not
//  Middleware has access to the request and response objects

const ensureAuth = function (req, res, next) {
    // Express
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
  const ensureGuest = function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/applications");
    } else {
      return next();
    }
  };
  
  module.exports = {
    ensureAuth,
    ensureGuest,
  };
  