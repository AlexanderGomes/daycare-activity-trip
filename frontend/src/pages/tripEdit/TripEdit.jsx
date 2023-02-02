import React, { useEffect, useState, useRef } from "react";
import { Destination, Overview } from "../../components";
import { useParams } from "react-router-dom";
import gifDefault from "../../assets/default-search.svg";
import axios from "axios";
import "./TripEdit.css";
import { useSelector } from "react-redux";

const TripEdit = ({ socket, setNotiData, notiData, setArrival }) => {
  const [toggle, setToggle] = useState("overview");
  const [pickOverview, setPickOverview] = useState(null);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTraveler, setIsTraveler] = useState(false);
  const [active, setActiveAllowed] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [updatedTrip, setUpdatedTrip] = useState(null);
  const [trip, setTrip] = useState([]);
  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getTripById();
    getAllowedUsers();
  }, []);

  const getTripById = async () => {
    const res = await axios.get(`/api/trip/byId/${id}`);
    setTrip(res.data);
  };

  const getAllowedUsers = async () => {
    const res = await axios.get(`/api/user/get/allowed/users/${id}`);
    setAllowedUsers(res.data);
  };

  const GetChosenTemps = async () => {
    try {
      const res = await axios.get(`/api/temp/get/chosen/${id}`);
      setChosen(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    GetChosenTemps();
  }, []);

  useEffect(() => {
    let activeAllowed = [];

    allowedUsers.admin?.filter((id) => {
      if (user._id === id) {
        setIsAdmin(true);
      }
      activeAllowed.push(id);
    });

    allowedUsers.travelers?.filter((id) => {
      if (user._id === id) {
        setIsTraveler(true);
      }
      activeAllowed.push(id);
    });
    setActiveAllowed(activeAllowed);
  }, [allowedUsers, user]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getUserOnTrip", (data) => {
        setUpdatedTrip({
          userId: data.userId,
        });
      });
    }
  }, []);

  
  useEffect(() => {
    if (updatedTrip !== null) {
      if (updatedTrip.userId === user._id) {
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      }
    }
  }, [updatedTrip]);

  return (
    <div className="tripedit__main">
      {isAdmin === true || isTraveler === true ? (
        <>
          <div className="tripedit__top">
            <h1 className="tripedit__welcome">
              Welcome to <span className="tripedit__span">{trip.name}</span>{" "}
              trip.
            </h1>
            <img
              className="trip__img__edit"
              src={trip.img ? trip.img : gifDefault}
              alt=""
            />
          </div>
          <div className="tripedit__navbar__main">
            <div className="tripedit__navbar__color">
              <ul className="tripedit__navbar__ul">
                <li
                  className={toggle === "overview" && "active__line"}
                  onClick={() => setToggle("overview")}
                >
                  Overview
                </li>

                <li
                  className={toggle === "destination" && "active__line"}
                  onClick={() => setToggle("destination")}
                >
                  Destination
                </li>
                <li
                  className={toggle === "restaurant" && "active__line"}
                  onClick={() => setToggle("restaurant")}
                >
                  Restaurant
                </li>
                <li
                  className={toggle === "activities" && "active__line"}
                  onClick={() => setToggle("activities")}
                >
                  Activities
                </li>
                <li
                  className={toggle === "stays" && "active__line"}
                  onClick={() => setToggle("stays")}
                >
                  Stays
                </li>
              </ul>
            </div>
          </div>

          <div className="tripedit__toggle">
            {toggle === "destination" && (
              <Destination
                currentLabel={toggle}
                tripId={id}
                socket={socket}
                setPickOverview={setPickOverview}
                isAdmin={isAdmin}
                isTraveler={isTraveler}
                active={active}
              />
            )}
            {toggle === "restaurant" && (
              <Destination
                currentLabel={toggle}
                tripId={id}
                socket={socket}
                setPickOverview={setPickOverview}
                isAdmin={isAdmin}
                isTraveler={isTraveler}
                active={active}
              />
            )}
            {toggle === "activities" && (
              <Destination
                currentLabel={toggle}
                tripId={id}
                socket={socket}
                setPickOverview={setPickOverview}
                isAdmin={isAdmin}
                isTraveler={isTraveler}
                active={active}
              />
            )}
            {toggle === "stays" && (
              <Destination
                currentLabel={toggle}
                tripId={id}
                socket={socket}
                setPickOverview={setPickOverview}
                isAdmin={isAdmin}
                active={active}
                isTraveler={isTraveler}
              />
            )}
            {toggle === "overview" && (
              <Overview
                currentLabel={toggle}
                tripId={id}
                pickOverview={pickOverview}
                socket={socket}
                isAdmin={isAdmin}
                isTraveler={isTraveler}
                setTrip={setTrip}
                setNotiData={setNotiData}
                notiData={notiData}
                setArrival={setArrival}
                active={active}
              />
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default TripEdit;
