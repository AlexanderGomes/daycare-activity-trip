import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Welcome, Trip, Profile, Auth, TripEdit } from "./pages";
import { Navbar, Footer } from "./components";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { io } from "socket.io-client";

function App() {
  const [trips, setTrips] = useState([]);
  const socket = useRef();
  const [notiData, setNotiData] = useState([]);

  const [arrival, setArrival] = useState(null);
  const [data, setData] = useState(null);

  const [updatedUser, setUpdatedUser] = useState(null);

  useEffect(() => {
    socket.current = io("https://www.tripplanet.org");
  }, []);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      socket.current.emit("addUser", user._id);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/user/get/invitation/${user._id}`);
      setNotiData(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getAllTrips = async () => {
    try {
      const res = await axios.get(`/api/trip/${user._id}/get/all`);
      setTrips(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllTrips();
  }, [user]);

  useEffect(() => {
    socket.current.on("getNotification", (data) => {
      setArrival({
        _id: data._id,
        desc: data.desc,
        tripId: data.tripId,
        userId: data.userId,
        wasSent: data.wasSent,
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("getAccept", (data) => {
      setUpdatedUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        invitations: data.invitations,
        invitedTo: data.invitedTo,
      });
    });
  }, []);

  useEffect(() => {
    if (updatedUser !== null || arrival !== null) {
      fetchNotifications();
    }
  }, [updatedUser, arrival]);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/c/auth" />;
    }
  };

  return (
    <>
      <Router>
        <Navbar socket={socket} notiData={notiData} />
        <div className="bottom">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route
              path="/c/trip"
              element={user ? <Trip socket={socket} trips={trips} /> : <Auth />}
            />
            <Route
              path="/c/trip/edit/:id"
              element={
                user ? (
                  <TripEdit
                    socket={socket}
                    trips={trips}
                    setNotiData={setNotiData}
                    notiData={notiData}
                    setArrival={setArrival}
                  />
                ) : (
                  <Auth />
                )
              }
            />
            <Route
              path="/c/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/c/auth"
              element={user ? <Navigate to={"/c/trip"} /> : <Auth />}
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
