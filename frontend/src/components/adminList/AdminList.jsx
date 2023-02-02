import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./AdminList.css";

const AdminList = ({ users, tripId, setTrip, socket }) => {
  const { user } = useSelector((state) => state.auth);

  const RemoveAdmin = async () => {
    try {
      await axios.put(`/api/user/${tripId}/${users._id}/remove/admin`);

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
    <div className="list__main move">
      <div className="admin__info">
        <div>
          <p>{users.name}</p>
          <p>{users.email}</p>
        </div>
          <div className="btns__move">
            {" "}
            <button
              className="btn__admin admin__list__btn"
              onClick={RemoveAdmin}
            >
              remove admin
            </button>
            <button
              className="btn__remove admin__list__btn"
              onClick={RemoveFromTrip}
            >
              remove
            </button>
          </div>
      </div>
    </div>
  );
};

export default AdminList;
