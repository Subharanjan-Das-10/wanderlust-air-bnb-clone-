const mongoose =require ("mongoose");
const initData = require("./data.js");
const Listing = require ("../models/listing.js");


main()
.then(() =>{
console.log("connecting to db");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  };

  const initDb =async() =>{
    await Listing.deleteMany({});  // thats use for exiting data deleting
    await Listing.insertMany(initData.data); //initdata is object and data exiting data 
    console.log("data was initiliazed");

  };

  initDb(); //call the function