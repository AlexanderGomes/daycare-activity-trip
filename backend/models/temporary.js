const mongoose = require("mongoose");

// array of reactions

const TempSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    bronze: {
      type: Number,
      default: 0,
    },
    gold: {
      type: Number,
      default: 0,
    },
    silver: {
      type: Number,
      default: 0,
    },
    isWinner: {
      type: Boolean,
      default: false,
    },
    wasChosen: {
      type: Boolean,
      default: false,
    },

    //can just vote
    travelers: {
      type: Array,
      default: [],
    },

    // can edit and vote
    admins: {
      type: Array,
      default: [],
    },

    label: String,
    address: String,
    img: String,
    url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Temp", TempSchema);
