import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";

const Notification = ({ data, socket }) => {

  const Accept = async () => {
    try {
      const res = await axios.put(`/api/user/invite/accept/${data._id}`);
      socket.current.emit("setAccept", {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        invitedTo: res.data.invitedTo,
        invitations: res.data.invitations,
      });
      socket.current.emit("setChange", {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        invitedTo: res.data.invitedTo,
        invitations: res.data.invitations,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const Decline = async () => {
    try {
      const res = await axios.delete(`/api/user/invite/decline/${data._id}`);
      socket.current.emit("setAccept", {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        invitedTo: res.data.invitedTo,
        invitations: res.data.invitations,
      });
      socket.current.emit("setChange", {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        invitedTo: res.data.invitedTo,
        invitations: res.data.invitations,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="noti__main">
      <div className="noti__info">
        <p className="noti__desc">{data.desc}</p>
        <div className="noti__btns">
          <button className="noti__accept" onClick={Accept}>
            accept
          </button>
          <button className="noti__decline" onClick={Decline}>
            decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
