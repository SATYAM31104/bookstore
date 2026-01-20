const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        bookId: {
          type: String,
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
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1
        },
        thumbnail: {
          type: String
        }
      }
    ],

    shippingAddress: {
      name: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "cod"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },

    subtotal: {
      type: Number,
      required: true,
      default: 0
    },

    shipping: {
      type: Number,
      required: true,
      default: 0
    },

    tax: {
      type: Number,
      required: true,
      default: 0
    },

    codCharges: {
      type: Number,
      default: 0
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "confirmed"
    },

    orderStatus: {
      type: String,
      enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);