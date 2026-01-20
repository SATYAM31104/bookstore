const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        bookId: {
          type: String, // Google Books ID
          required: true
        },
        title: {
          type: String,
          required: true
        },
        author: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        thumbnail: {
          type: String
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

// Ensure one wishlist per user
wishlistSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);