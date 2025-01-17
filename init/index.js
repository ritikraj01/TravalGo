const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/drum";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const updatedUsers = initData.data.map(user => ({
    ...user,               
    owner: '67869a91aaa988453a57d0ca'       
}));
  await Listing.insertMany(updatedUsers);
  console.log("data was initialized");
};

initDB();