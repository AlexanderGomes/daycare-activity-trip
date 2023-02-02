const express = require("express");
const dotenv = require("dotenv").config();

const port = process.env.PORT || 5000;
const dbConnect = require("./utils/dbConnect");

//folders
const UserRoutes = require("./routes/user");
const TripRoutes = require("./routes/trip");
const TempRoutes = require("./routes/temporary");

//activating
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/user", UserRoutes);
app.use("/api/trip", TripRoutes);
app.use("/api/temp", TempRoutes);

app.listen(port, async () => {
  await dbConnect();
  console.log("mongodb connected");
  console.log(`server on port ${port}`);
});
