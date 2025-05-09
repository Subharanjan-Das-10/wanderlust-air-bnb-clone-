const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const warpAsync = require("../utils/warpAsync");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");

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
  router.get("/new", (req, res) => {
    res.render("./listing/new.ejs");
  });
  
  // Show route
  router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listing/show.ejs", { listing });
  });
  
  // Create route
  router.post("/listing",validateListing,warpAsync (async (req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  }));
  
  // Edit form
  router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
  });
  
  // Update route
  router.put("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listing");
  });
  
  // Delete route
  router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  });


  module.exports = router;