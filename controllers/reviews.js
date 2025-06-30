const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");


module.exports.createReviews = (async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.listing = listing.id; 
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview.id);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
  });

  module.exports.destoryReviews = (async (req, res) => {
    let { reviewId } = req.params;
    let id = req.params.id; // Get id from req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  });