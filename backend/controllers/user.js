const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Trip = require("../models/trip");
const Invitation = require("../models/invitation");
const asyncHandler = require("express-async-handler");
const dbConnect = require("../utils/dbConnect");
dbConnect();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  const findUser = await User.findOne({ email });

  if (findUser) {
    return res.status(400).json({ msg: "there's an account on this email" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400).json("invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //finding user
  const user = await User.findOne({ email });

  //validation
  if (!user) {
    res.status(405).json("Wrong email");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(402).json({ msg: "passwords don't match" });
  }

  //comparing hashed password and sending back information
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  }
});

const inviteUser = asyncHandler(async (req, res) => {
  const userInviting = await User.findById(req.params.id);
  const userInvited = await User.findById(req.body.userId);
  const trip = await Trip.findById(req.body.tripId);

  const isInvited = await Invitation.findOne({
    userId: userInvited._id.toString(),
    tripId: trip._id.toString(),
  });

  if (isInvited) {
    const updatedUser = await User.findByIdAndUpdate(
      userInvited._id.toString(),
      { $pull: { invitations: trip._id.toString() } },
      { new: true }
    );

    await Invitation.findByIdAndDelete(isInvited._id.toString());
    return res
      .status(200)
      .json({ updatedUser: updatedUser, invitation: isInvited });
  }

  try {
    const invitation = new Invitation({
      userId: userInvited._id.toString(),
      tripId: trip._id.toString(),
      desc: `${userInviting.name} invited you to the exciting ${trip.name} trip !!!`,
    });
    await invitation.save();

    const updatedUser = await User.findByIdAndUpdate(
      userInvited._id.toString(),
      { $push: { invitations: trip._id.toString() } },
      { new: true }
    );
    res.status(200).json({ updatedUser: updatedUser, invitation: invitation });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const acceptInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);

  if (!invitation) {
    return res.status(400).json("invitation already accepted");
  }

  const user = await User.findById(invitation.userId);
  const trip = await Trip.findById(invitation.tripId);

  isTaken = false;

  trip?.travelers.filter((id) => {
    if (user._id.toString() === id) {
      isTaken = true;
    }
  });

  if (isTaken === true) {
    return res.status(430).json("user is already on the trip");
  }

  try {
    await Trip.findByIdAndUpdate(
      trip._id.toString(),
      { $push: { travelers: user._id.toString() } },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      user._id.toString(),
      { $push: { invitedTo: trip._id.toString() } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      user._id.toString(),
      { $pull: { invitations: trip._id.toString() } },
      { new: true }
    );

    await Invitation.findByIdAndDelete(invitation._id.toString());

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const declineInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  const user = await User.findById(invitation.userId);
  const trip = await Trip.findById(invitation.tripId);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id.toString(),
      { $pull: { invitations: trip._id.toString() } },
      { new: true }
    );

    await Invitation.findByIdAndDelete(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.find({
    userId: req.params.userId,
  });
  try {
    res.status(200).json(invitation);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getUsersInvitedTo = asyncHandler(async (req, res) => {
  const users = await User.findById(req.params.userId);

  let tripIds = [];

  users.invitedTo?.map((p) => {
    tripIds.push(p);
  });

  const trips = await Trip.find({ _id: { $in: tripIds } });

  try {
    res.status(200).json(trips);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllowedUsers = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);

  let travelers = [];
  let admins = [];

  trip.travelers.map((tr) => {
    travelers.push(tr);
  });

  trip.admins.map((tr) => {
    admins.push(tr);
  });

  try {
    res.status(200).json({ travelers: travelers, admin: admins });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllowedUsersInfo = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);

  let travelers = [];
  let admins = [];

  trip.travelers.map((tr) => {
    travelers.push(tr);
  });

  trip.admins.map((tr) => {
    admins.push(tr);
  });

  const travelersInfo = await User.find({ _id: { $in: travelers } });
  const adminsInfo = await User.find({ _id: { $in: admins } });

  try {
    res.status(200).json({ travelers: travelersInfo, admin: adminsInfo });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const addAdmin = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  const user = await User.findById(req.params.userId);

  try {
    await Trip.findByIdAndUpdate(
      trip._id.toString(),
      { $pull: { travelers: user._id.toString() } },
      { new: true }
    );

    await Trip.findByIdAndUpdate(
      trip._id.toString(),
      { $push: { admins: user._id.toString() } },
      { new: true }
    );

    res.status(200).json("admin added");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const removeAdmin = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  const user = await User.findById(req.params.userId);

  try {
    await Trip.findByIdAndUpdate(
      trip._id.toString(),
      { $pull: { admins: user._id.toString() } },
      { new: true }
    );
    await Trip.findByIdAndUpdate(
      trip._id.toString(),
      { $push: { travelers: user._id.toString() } },
      { new: true }
    );

    res.status(200).json("admin removed");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const removeUserFromTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  const user = await User.findById(req.params.userId);

  try {
    await Trip.findByIdAndUpdate(
      trip._id.toString(),
      { $pull: { travelers: user._id.toString() } },
      { new: true }
    );

    await Trip.findByIdAndUpdate(
      trip._id.toString(),
      { $pull: { admins: user._id.toString() } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      user._id.toString(),
      { $pull: { invitedTo: trip._id.toString() } },
      { new: true }
    );

    res.status(200).json("admin removed");
  } catch (error) {
    res.status(400).json(error.message);
  }
});


const userById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(302).send({ msg: "user does not exist" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = {
  registerUser,
  loginUser,
  inviteUser,
  acceptInvitation,
  declineInvitation,
  getInvitation,
  getAllUsers,
  getUsersInvitedTo,
  getAllowedUsers,
  getAllowedUsersInfo,
  addAdmin,
  removeAdmin,
  removeUserFromTrip,
  userById
};
