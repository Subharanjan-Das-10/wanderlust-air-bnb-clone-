const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const  methodOverride = require("method-override");
const { console } = require("inspector");
const ejsMate = require("ejs-mate"); //use for ejs template



main()
.then(() =>{
console.log("connecting to db");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  };

  app.set ("view engine","ejs");
  app.set ("views", path.join(__dirname, "views"));
  app.use("/public", express.static("public"));
  app.use (express.urlencoded ({extended : true}));//fllowing all data are pass by this code
  app.use(methodOverride("_method"));
  app.engine("ejs", ejsMate);  //use ejs


app.get ("/",(req,res) =>{
    res.send("hi i am root");
});

//index route

app.get ("/listing", async(req,res) =>{
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs",{allListing});

});

app.get("/listing/new", (req,res)=>{
     res.render("./listing/new.ejs");
 });
//show route
app.get("/listing/:id", async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/show.ejs",{listing});
});

//create route
app.post("/listing",async(req,res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
});

//edit route 

app.get("/listing/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs",{listing});
});

//update route
app.put("/listing/:id", async(req,res)=>{
    let {id} = req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing}); //reconstract using this fomat
  res.redirect("/listing");
});

//delete route

app.delete("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");

});



// app.get ("/testListing", async (req,res) =>{
//     let sampleListing = new Listing ({
//         title : "my home",
//         description : "by the beach",
//         price : 1200,
//         location : "kolkata",
//         country : "india",
//     });
//     await sampleListing.save();
//     console.log("data was saved");
//     res.send ("successfull");

// });


app.listen (8080,()=>{
    console.log("server is listing to port 8080");
});