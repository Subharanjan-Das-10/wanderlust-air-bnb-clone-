if ( process.env.NODE_ENV != "production"){
require('dotenv').config();
};
console.log(process.env) ;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/ExpressError.js");
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/reviews.js");
const userRouter = require("./router/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");


// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //  Use __dirname instead of undefined 'dirname'

// Routes
app.get("/", (req, res) => {
  res.send("hi I am root");
});
// Middleware
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Session configuration
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to pass flash messages to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/", userRouter)


// 404 handler
app.all(/.*/, (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

// Generic error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listing/error.ejs", { err });
});

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});