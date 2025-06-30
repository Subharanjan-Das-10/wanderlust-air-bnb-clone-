const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({ 
    ...obj, owner: "6844739e8fe27677b97eab82" }));
    console.log(initData.data);
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDb();
