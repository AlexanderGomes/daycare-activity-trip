const express = require("express");
 require("dotenv").config();
 const path = require("path");

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


//Server frontend
if (process.env.NODE__ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.listen(port, async () => {
  await dbConnect();
  console.log("mongodb connected");
  console.log(`server on port ${port}`);
});
