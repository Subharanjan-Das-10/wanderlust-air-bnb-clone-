const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAsync");
const { isLoggedIn, validateListing, isOwner } = require("../utils/middleware.js");
const listingsController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloud_Config.js");
const upload = multer({ storage });

// Index route
router.route("/")
.get(warpAsync(listingsController.index))
.post( isLoggedIn,
      validateListing, 
upload.single("listing[image]"),
 warpAsync(listingsController.createListing));



// New listing form
router.get("/new", isLoggedIn, listingsController.renderNewForm);


// Show route
router.route("/:id")
.get( warpAsync(listingsController.showListing))
.put( isLoggedIn,
     isOwner,
     upload.single("listing[image]"),
      validateListing, 
      warpAsync(listingsController.updateListing))
.delete( isLoggedIn, 
    isOwner,
     warpAsync(listingsController.destroyListing));
// Edit form
router.get("/:id/edit", isLoggedIn, isOwner, warpAsync(listingsController.editListing));


module.exports = router;