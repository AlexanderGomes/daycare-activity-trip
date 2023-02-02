const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log("a user connected.");
    addUser(userId, socket.id);

    io.emit("getUsers", users);
  });

  // add new destination
  socket.on(
    "createDest",
    ({ userId, tripId, label, address, img, url, _id, allowedUsers }) => {
      io.emit("getDest", {
        userId,
        tripId,
        label,
        address,
        img,
        url,
        _id,
        allowedUsers,
      });
    }
  );

  // set favorite
  socket.on(
    "setFavorite",
    ({
      userId,
      tripId,
      label,
      address,
      img,
      url,
      _id,
      bronze,
      gold,
      silver,
      wasChosen,
      isWinner,
    }) => {
      io.emit("getFavorite", {
        userId,
        tripId,
        label,
        address,
        img,
        url,
        _id,
        bronze,
        gold,
        silver,
        wasChosen,
        isWinner,
      });
    }
  );

  //vote destination
  socket.on(
    "setLike",
    ({
      userId,
      tripId,
      label,
      address,
      img,
      url,
      _id,
      bronze,
      gold,
      silver,
      wasChosen,
      isWinner,
    }) => {
      io.emit("getLike", {
        userId,
        tripId,
        label,
        address,
        img,
        url,
        _id,
        bronze,
        gold,
        silver,
        wasChosen,
        isWinner,
      });
    }
  );

  //like
  socket.on(
    "setPick",
    ({
      userId,
      tripId,
      label,
      address,
      img,
      url,
      _id,
      bronze,
      gold,
      silver,
      wasChosen,
      isWinner,
    }) => {
      io.emit("getPick", {
        userId,
        tripId,
        label,
        address,
        img,
        url,
        _id,
        bronze,
        gold,
        silver,
        wasChosen,
        isWinner,
      });
    }
  );

  //invitation
  socket.on("setInvitation", ({ _id, name, email, invitedTo, invitations }) => {
    io.emit("getInvitation", {
      _id,
      name,
      email,
      invitedTo,
      invitations,
    });
  });

  //notification
  socket.on("setNotification", ({ _id, desc, tripId, userId, wasSent }) => {
    const user = getUser(userId);
    if (user) {
      io.to(user.socketId).emit("getNotification", {
        _id,
        desc,
        tripId,
        userId,
        wasSent,
      });
    }
  });

  //accpet invitation
  socket.on("setAccept", ({ _id, name, email, invitedTo, invitations }) => {
    const user = getUser(_id);

    if (user) {
      io.to(user.socketId).emit("getAccept", {
        _id,
        name,
        email,
        invitedTo,
        invitations,
      });
    }
  });

  //accpet invitation
  socket.on("setChange", ({ _id, name, email, invitedTo, invitations }) => {
    io.emit("getChange", {
      _id,
      name,
      email,
      invitedTo,
      invitations,
    });
  });

  socket.on("setUserOnTrip", ({ userId }) => {
    io.emit("getUserOnTrip", {
      userId,
    });
  });

  
  //delete destination
  socket.on("deleteDest", ({ _id }) => {
    io.emit("getDeleteId", {
      _id,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
