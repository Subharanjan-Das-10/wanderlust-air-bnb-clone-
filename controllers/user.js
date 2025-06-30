const User = require("../models/user.js");


module.exports.usersSignup = (req, res) => {
  res.render("users/signup.ejs");
};


module.exports.usersSignupPost = (async (req, res, next) => {
    try {
      let { username, email, password } = req.body.form;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (e) {
  req.flash("error", e.message);
  return res.redirect("/signup"); // Add return statement
}

  });


  module.exports.usersLogin =  (req, res) => {
  res.render("users/login.ejs");
};

module.exports.usersLoginPost = async (req, res,next) => {
    try {
      req.flash("success", `Welcome to Wonderlust! @${req.user.username}`);
      let redirectUrl = res.locals.redirectUrl ||"/listings";
      res.redirect(redirectUrl);
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/login");
      next(e)
    }
  };


module.exports.usersLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "logged you are it");
  res.redirect("/listings");
};

