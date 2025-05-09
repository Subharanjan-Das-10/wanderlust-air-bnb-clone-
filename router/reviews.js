const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/warpAsync");
const expressError = require("../utils/expressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

const validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errorMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errorMsg);
    } else {
      next();
    }
  };
  
//reviews route
//post route
router.post("/", validateReviews, warpAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.listing = listing.id; 
    listing.reviews.push(newReview.id);
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${req.params.id}`);
  }));
  //delete reviews route
  router.delete("/:reviewId", warpAsync(async (req, res) => {
    let { reviewId } = req.params;
    let id = req.params.id; // Get id from req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
  }));
  
  
module.exports = router;