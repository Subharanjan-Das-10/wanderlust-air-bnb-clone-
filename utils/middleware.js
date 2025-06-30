const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {reviewSchema,listingSchema} = require("../schema.js");
const ExpressError = require('./ExpressError');



 module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You need to login before adding a new listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!req.user || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to perform this action");
    return res.redirect(`/listings/${id}`);
  }
  next();
};



module.exports.validateListing = (req,res,next) =>{

  let {error}=listingSchema.validate(req.body);
  console.log(error);
  if(error){
    throw new ExpressError(400,error);
  }else{
    next();
  }
};

module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errorMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errorMsg);
    } else {
      next();
    }
  };




module.exports.isReviewsAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!req.user || !review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to perform this action");
    return res.redirect(`/listings/${id}`);
  }
  next();
};