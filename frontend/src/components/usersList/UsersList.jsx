import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import "./UsersList.css";

const UsersList = ({ tripId, setUser, socket, data, users }) => {
  const [isOnTrip, setIsOnTrip] = useState(false);
  const [wasSent, setWasSent] = useState([]);
  const [updatedUser, setUpdatedUser] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    socket.current.on("getInvitation", (data) => {
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
    if (updatedUser) {
      // find index of non updated obj
      let itemIndex = users
        .map((item, index) => {
          if (item._id === updatedUser._id) {
            return index;
          }
        })
        .filter((item) => item !== undefined)[0];

      // remove non updated obj from array
      const newObj = users.filter((p) => updatedUser._id !== p._id);

      // add updated version to  array
      const insert = (arr, index, ...newItems) => [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted items
        ...newItems,
        // part of the array after the specified index
        ...arr.slice(index),
      ];

      const result = insert(newObj, itemIndex, updatedUser);

      //update state
      setUser([...result]);
    }
  }, [updatedUser]);

  useEffect(() => {
    //user is on the trip, trip id goes to this array when invite is accepted
    data.invitedTo.filter((trip) => {
      if (tripId === trip) {
        setIsOnTrip(true);
      }
    });

    if (data.invitations.includes(tripId)) {
      setWasSent(true);
    } else {
      setWasSent(false);
    }
  }, [updatedUser, data]);

  // get data and update
  const InviteUser = async () => {
    try {
      const res = await axios.post(`/api/user/invite/${user._id}`, {
        userId: data._id,
        tripId: tripId,
      });
      socket.current.emit("setInvitation", {
        _id: res.data.updatedUser._id,
        name: res.data.updatedUser.name,
        email: res.data.updatedUser.email,
        invitations: res.data.updatedUser.invitations,
        invitedTo: res.data.updatedUser.invitedTo,
      });
      socket.current.emit("setNotification", {
        _id: res.data.invitation._id,
        desc: res.data.invitation.desc,
        tripId: res.data.invitation.tripId,
        userId: res.data.invitation.userId,
        wasSent: res.data.invitation.wasSent,
      });
    } catch (error) {
      console.log(error.message);
    }
  };



  return (
    <div className="list__main">
      {user._id !== data._id && (
        <div className="list__info">
          <div>
            <p>{data.name}</p>
            <p>{data.email}</p>
          </div>
          <div className="list__btns">
            {isOnTrip === true ? (
              <p className="on__trip">on trip</p>
            ) : (
              <button className="btn__invite" onClick={InviteUser}>
                {wasSent === true ? "remove" : "invite"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
