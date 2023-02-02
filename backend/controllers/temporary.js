const Temp = require("../models/temporary");
const Like = require("../models/like");
const Trip = require("../models/trip");
const asyncHandler = require("express-async-handler");


const createTemp = asyncHandler(async (req, res) => {
  const newTemp = new Temp(req.body);
  try {
    const savedTemp = await newTemp.save();
    res.status(200).json(savedTemp);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const GetByTempLabel = asyncHandler(async (req, res) => {
  const tempObj = await Temp.find({
    tripId: req.params.id,
    label: req.params.label,
  });

  try {
    res.status(200).json(tempObj);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const deleteTemp = asyncHandler(async (req, res) => {
  try {
    await Temp.findByIdAndDelete(req.params.id);
    res.status(200).json("success");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// TODO -- can't remove the like, fix it
const likeTemp = asyncHandler(async (req, res) => {
  const { type, userId } = req.body;
  const temp = await Temp.findById(req.params.id);
  const isLiked = await Like.findOne({ userId: userId, tempId: temp._id });

  if (isLiked) {
    if (isLiked.reaction === "bronze" && temp.bronze > 0) {
      await temp.updateOne({ $inc: { bronze: -1 } }, { new: true });
    } else if (isLiked.reaction === "silver" && temp.silver > 0) {
      await temp.updateOne({ $inc: { silver: -1 } }, { new: true });
    } else {
      if (temp.gold > 0) {
        await temp.updateOne({ $inc: { gold: -1 } }, { new: true });
      }
    }
    await Like.findByIdAndDelete(isLiked._id);
  }

  try {
    if (type === "bronze") {
      const currentTemp = await Temp.findOneAndUpdate(
        temp._id,
        { $inc: { bronze: 1 } },
        { new: true }
      );
      res.status(200).json(currentTemp);
    } else if (type === "silver") {
      const currentTemp = await Temp.findOneAndUpdate(
        temp._id,
        { $inc: { silver: 1 } },
        { new: true }
      );
      res.status(200).json(currentTemp);
    } else {
      const currentTemp = await Temp.findOneAndUpdate(
        temp._id,
        { $inc: { gold: 1 } },
        { new: true }
      );
      res.status(200).json(currentTemp);
    }

    const like = new Like({
      userId: userId,
      tempId: temp._id,
      reaction: type,
    });

    await like.save();
  } catch (error) {
    res.status(400).json(error.message);
  }
});
const getTempLikes = asyncHandler(async (req, res) => {
  const { tempId, userId } = req.params;

  try {
    const tempLikes = await Like.find({ tempId: tempId, userId: userId });
    res.status(200).json(tempLikes);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const setFavorite = asyncHandler(async (req, res) => {
  const temp = await Temp.findById(req.params.id);

  try {
    if (temp.isWinner === false) {
      const updatedTemp = await Temp.findOneAndUpdate(
        temp._id,
        { $set: { isWinner: true } },
        { new: true }
      );
      res.status(200).json(updatedTemp);
    } else {
      const updatedTemp = await Temp.findOneAndUpdate(
        temp._id,
        { $set: { isWinner: false } },
        {
          new: true,
        }
      );
      res.status(200).json(updatedTemp);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//TODO-- Pick function
const chooseFinalObj = asyncHandler(async (req, res) => {
  const temp = await Temp.findById(req.body.tempId);
  const trip = await Trip.findById(req.params.tripId);

  try {
    if (temp.label === "destination") {
      isTempTaken = false;

      trip.destination.map((d) => {
        if (d === temp._id.toString()) {
          isTempTaken = true;
        }
      });

      if (isTempTaken === true) {
        return res.status(433).json("destination already choosen");
      }

      await Trip.findOneAndUpdate(
        trip._id,
        { $push: { destination: temp._id.toString() } },
        {
          new: true,
        }
      );
      const updatedTrip = await Temp.findOneAndUpdate(
        temp._id,
        { $set: { wasChosen: true } },
        {
          new: true,
        }
      );

      res.status(200).json(updatedTrip);
    } else if (temp.label === "restaurant") {
      isTempTaken = false;

      trip.restaurant.map((d) => {
        if (d === temp._id.toString()) {
          isTempTaken = true;
        }
      });

      if (isTempTaken === true) {
        return res.status(433).json("restaurant already choosen");
      }

      await Trip.findOneAndUpdate(
        trip._id,
        { $push: { restaurant: temp._id.toString() } },
        {
          new: true,
        }
      );

      const updatedTrip = await Temp.findOneAndUpdate(
        temp._id,
        { $set: { wasChosen: true } },
        {
          new: true,
        }
      );

      res.status(200).json(updatedTrip);
    } else if (temp.label === "activities") {
      isTempTaken = false;

      trip.activities.map((d) => {
        if (d === temp._id.toString()) {
          isTempTaken = true;
        }
      });

      if (isTempTaken === true) {
        return res.status(433).json("restaurant already choosen");
      }

      await Trip.findOneAndUpdate(
        trip._id,
        { $push: { activities: temp._id.toString() } },
        {
          new: true,
        }
      );

      const updatedTrip = await Temp.findOneAndUpdate(
        temp._id,
        { $set: { wasChosen: true } },
        {
          new: true,
        }
      );

      res.status(200).json(updatedTrip);
    } else if (temp.label === "stays") {
      isTempTaken = false;

      trip.stays.map((d) => {
        if (d === temp._id.toString()) {
          isTempTaken = true;
        }
      });

      if (isTempTaken === true) {
        return res.status(433).json("restaurant already choosen");
      }

      await Trip.findOneAndUpdate(
        trip._id,
        { $push: { stays: temp._id.toString() } },
        {
          new: true,
        }
      );

      const updatedTrip = await Temp.findOneAndUpdate(
        temp._id,
        { $set: { wasChosen: true } },
        {
          new: true,
        }
      );
      res.status(200).json(updatedTrip);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getChosenTemp = asyncHandler(async (req, res) => {
  const tempObj = await Temp.find({
    tripId: req.params.id,
    wasChosen: true,
  });

  try {
    res.status(200).json(tempObj);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = {
  createTemp,
  deleteTemp,
  GetByTempLabel,
  likeTemp,
  getTempLikes,
  setFavorite,
  chooseFinalObj,
  getChosenTemp,
};
