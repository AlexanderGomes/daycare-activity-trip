const express = require("express");
const router = express.Router();

const {
  createTrip,
  updateTrip,
  getAllUserTrips,
  getTripById,
} = require("../controllers/trip");

router.post("/", createTrip);
router.put("/:tripId", updateTrip);
router.get("/:id/get/all", getAllUserTrips);
router.get("/byId/:id", getTripById);

module.exports = router;
