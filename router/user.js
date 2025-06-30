const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/warpAsync");
const passport = require("passport");
const usersControllers = require("../controllers/user.js");
const { saveRedirectUrl } = require("../utils/middleware.js");

router.route("/signup")
  .get(usersControllers.usersSignup)
  .post(wrapAsync(usersControllers.usersSignupPost));

router.route("/login")
  .get(usersControllers.usersLogin)
  .post(saveRedirectUrl, 
    passport.authenticate("local", 
      { failureRedirect: "/login",
         failureFlash: true }), 
      wrapAsync(usersControllers.usersLoginPost));

router.get("/logout", usersControllers.usersLogout);

module.exports = router;
