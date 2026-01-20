const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },

    password: {
      type: String,
      required: function() {
        return this.provider === "local";
      }
    },

    avatar: String,

    provider: {
      type: String,           // "local", "google", "github", "apple"
      required: true,
      default: "local"
    },

    providerUserId: {
      type: String,
      required: true,
      unique: true
    },

    emailVerified: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);