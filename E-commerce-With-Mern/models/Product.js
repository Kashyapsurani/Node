const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
 
module.exports = mongoose.model("Product", ProductSchema);
