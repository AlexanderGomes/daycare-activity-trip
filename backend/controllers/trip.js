const User = require("../models/user");
const Trip = require("../models/trip");
const asyncHandler = require("express-async-handler");

const createTrip = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  const { name, img } = req.body;

  if (!name) {
    return res.status(420).json({ msg: "name and description are required" });
  }

  try {
    const newTrip = new Trip({
      userId: user._id,
      name: name,
      img: img,
      admins: user._id.toString(),
    });
    const savedTrip = await newTrip.save();
    res.status(200).json(savedTrip);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const updateTrip = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  const trip = await Trip.findById(req.params.tripId);

  try {
    if (trip.userId.toString() === user._id.toString()) {
      await trip.updateOne({ $set: req.body });
    }
    res.status(200).json("trip updated");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllUserTrips = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const trip = await Trip.find({ userId: user._id });
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getTripById = asyncHandler(async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = {
  createTrip,
  updateTrip,
  getAllUserTrips,
  getTripById,
};
