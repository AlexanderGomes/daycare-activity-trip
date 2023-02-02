const express = require("express");
const router = express.Router();

const {
  createTemp,
  deleteTemp,
  GetByTempLabel,
  likeTemp,
  getTempLikes,
  setFavorite,
  chooseFinalObj,
  getChosenTemp
} = require("../controllers/temporary");

router.post("/", createTemp);
router.delete("/delete/:id", deleteTemp);
router.put("/like/obj/:id", likeTemp);
router.put("/close/voting/:id", setFavorite);
router.put("/choose/obj/:tripId", chooseFinalObj);
router.get("/get/obj/data/:id/:label", GetByTempLabel);
router.get("/get/likes/:tempId/:userId", getTempLikes);
router.get("/get/chosen/:id", getChosenTemp);


module.exports = router;
