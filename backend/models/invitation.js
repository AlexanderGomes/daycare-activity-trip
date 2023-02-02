const mongoose = require("mongoose");

// array of reactions

const Invitation = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    wasSent: {
      type: Boolean,
      default: false,
    },
    desc: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invitation", Invitation);
