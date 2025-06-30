const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/warpAsync");
const expressError = require("../utils/expressError.js");
const{isLoggedIn,isReviewsAuthor,validateReviews} = require("../utils/middleware.js");
const listingsController = require("../controllers/reviews.js");


  
//reviews route
//post route
router.post("/",
  isLoggedIn,
   validateReviews,
   warpAsync(listingsController.createReviews));


  //delete reviews route
  router.delete("/:reviewId", 
      isLoggedIn,
      isReviewsAuthor,
    warpAsync(listingsController.destoryReviews));
  
  
module.exports = router;