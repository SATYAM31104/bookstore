const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    bookId: {
      type: String, // Changed from ObjectId to String for Google Books IDs
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity cannot be less than 1"]
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // one cart per user
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);