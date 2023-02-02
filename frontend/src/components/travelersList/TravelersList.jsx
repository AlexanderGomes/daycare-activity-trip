import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./TravelersList.css";

const TravelersList = ({ users, tripId, isAdmin, setTrip, socket }) => {
  const { user } = useSelector((state) => state.auth);

  const addAdmin = async () => {
    try {
      await axios.put(`/api/user/add/admin/${tripId}/${users._id}`);
      socket.current.emit("setUserOnTrip", {
        userId: users._id,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const RemoveFromTrip = async () => {
    try {
      await axios.put(`/api/user/${tripId}/${users._id}/remove/trip`);
      socket.current.emit("setUserOnTrip", {
        userId: users._id,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="list__main">
      <div className="list__info">
        <div>
          <p>{users.name}</p>
          <p>{users.email}</p>
          <div className="list__btns">
            {isAdmin === true ? (
              <div className="btns__admin">
                <button className="btn__admin btn" onClick={addAdmin}>
                  admin
                </button>
                <button className="btn__remove btn" onClick={RemoveFromTrip}>
                  remove
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelersList;
