const mongoose = require("mongoose");

// array of reactions

const LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tempId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temp",
    },
    reaction: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
