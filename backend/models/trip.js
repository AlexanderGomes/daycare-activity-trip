const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      require: [true, "trip's name is required"],
    },

    dates: [Date],
    destination: {
      type: Array,
      default: [],
    },
    restaurant: {
      type: Array,
      default: [],
    },
    activities: {
      type: Array,
      default: [],
    },
    stays: {
      type: Array,
      default: [],
    },
    travelers: {
      type: Array,
      default: [],
    },
    admins: {
      type: Array,
      default: [],
    },
    label: String,
    img: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
