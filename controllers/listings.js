const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });
  };

  module.exports.renderNewForm = (req, res) => {
    res.render("./listing/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id)
      .populate("owner")
      .populate({path:"reviews",
        populate:{
          path:"author",
        }
      });
  
     if(!listing){
        req.flash("error", "this listing does not exit");
        res.redirect("/listings");
      }else{
      res.render("listing/show.ejs", { listing, user: req.user,});
  
  
      }
      console.log (listing.owner);
    };


   module.exports.createListing = async (req, res, next) => {

   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
         .send()       

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

    module.exports.editListing =  async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
         if(!listing){
          req.flash("error", "this listing does not exit");
          res.redirect("/listings");
        }else{
         req.flash("success", "listings was edited sucessfully");
          let originalImageUrl = listing.image.url;
       originalImageUrl=originalImageUrl.replace("/uploads","/uploads/h_250,w_250")
    res.render("listing/edit.ejs", {listing, originalImageUrl});
        }
      };

      module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    
  }
  
  req.flash("success", "Listing was updated");
  res.redirect("/listings");
};


        module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "deleted sucessfully");
    res.redirect("/listings");
  };

    
  