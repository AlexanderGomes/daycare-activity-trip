const express = require("express");
const router = express.Router();

const {
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
  userById,
} = require("../controllers/user");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/invite/:id", inviteUser);
router.put("/invite/accept/:id", acceptInvitation);
router.put("/add/admin/:tripId/:userId", addAdmin);
router.put("/:tripId/:userId/remove/admin", removeAdmin);
router.put("/:tripId/:userId/remove/trip", removeUserFromTrip);
router.get("/verify/new/:id", userById);

router.delete("/invite/decline/:id", declineInvitation);
router.get("/get/invitation/:userId", getInvitation);
router.get("/get/users", getAllUsers);
router.get("/get/byId/:userId", getUsersInvitedTo);
router.get("/get/allowed/users/:tripId", getAllowedUsers);
router.get("/get/allowed/users/info/:tripId", getAllowedUsersInfo);

module.exports = router;
