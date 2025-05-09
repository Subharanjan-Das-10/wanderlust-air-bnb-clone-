const mongoose = require ("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type :String,
        required : true
    },
    description:{
        type :String
    },
     image : {
        url : String,
     },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
      
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && listing.reviews.length > 0) {
      try {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
      } catch (err) {
        console.error(err);
      }
    }
  });
  
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;