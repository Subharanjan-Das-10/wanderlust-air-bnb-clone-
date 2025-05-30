 module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You need to login before adding a new listing");
    return res.redirect("/login");
  }
  next();
};


