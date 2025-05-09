const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listings = require("./router/listing.js");
const reviews = require("./router/reviews.js");

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

// Set view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// Root route
app.get("/", (req, res) => {
  res.send("hi i am root");
});



app.use("/listing",listings);  //its using for using listing.js
app.use("/listings/:id/reviews",reviews);

// 404 handler
app.all(/.*/, (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

// Error handling middleware

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong!"}=err;
  res.status(statusCode).render("listing/error.ejs",{err})
  })

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});