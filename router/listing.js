const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/warpAsync");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const{isLoggedIn} = require("../utils/middleware.js");

const validateListing = (req,res,next) =>{
  let {error}=listingSchema.validate(req.body);
  console.log(error);
  if(error){
    throw new expressError(400,error);
  }else{
    next();
  }
};


// Index route
router.get("/", async (req, res) => {
    const allListing = await Listing.find({});
    
    res.render("./listing/index.ejs", { allListing });
  });
  
  // New listing form
  router.get("/new", isLoggedIn,(req, res) => {
    res.render("./listing/new.ejs");
  });
  
  // Show route
  router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
   if(!listing){
      req.flash("error", "this listing does not exit");
      res.redirect("/listing");
    }else{
    res.render("./listing/show.ejs", { listing });
    }
  });
  
  // Create route
router.post("/", validateListing, warpAsync,isLoggedIn,(async (req, res) => {
  const newListing = new Listing(req.body.listing);
   req.flash("success", "New listing was created");
  await newListing.save();
  res.redirect("/listing");
}));

  
  // Edit form
  router.get("/:id/edit",isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
      req.flash("error", "this listing does not exit");
      res.redirect("/listing");
    }else{
     req.flash("success", "listings was edited sucessfully");
    res.render("./listing/edit.ejs", { listing });
    }
  });
  
  // Update route
  router.put("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success", "listing was updated");
    res.redirect("/listing");
  });
  
  // Delete route
  router.delete("/:id",isLoggedIn, async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "deleted sucessfully");
    res.redirect("/listing");
  });


  module.exports = router;

  
