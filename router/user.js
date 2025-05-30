const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const warpAsync = require("../utils/warpAsync");
const passport = require("passport");


router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  warpAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err); // Now next is defined!
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listing");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);



router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  async (req, res,next) => {
    try {
      req.flash("success", `Welcome to Wonderlust! @${req.body.username}`);
      let redirectUrl = res.locals.redirectUrl ||"/listings";
      res.redirect(redirectUrl);
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/login");
      next(e)
    }
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "logged you are it");
  res.redirect("/listing");
});

module.exports = router;