const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookId: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String
    }
  },
  { timestamps: true }
);

// One review per user per book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);