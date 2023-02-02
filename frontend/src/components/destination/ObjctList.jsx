import React, { useEffect, useState, useRef } from "react";
import Search from "../../assets/Search-pana.svg";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import "./ObjcList.css";

import Bronze from "../../assets/bronze-cup.png";
import Gold from "../../assets/gold-cup.png";
import Silver from "../../assets/silver-cup.png";

//info needs to change all dinamically, add end voting func

const ObjctList = ({
  objData,
  pick,
  tripId,
  setTempObjData,
  tempObjData,
  setPick,
  socket,
  setPickOverview,
  isAdmin,
  allowedUsers,
}) => {
  const [confirm, setConfirm] = useState(false);
  const [type, setType] = useState("");
  const [deletes, setDeletes] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    socket.current.on("getDeleteId", (data) => {
      setDeletes({
        _id: data._id,
      });
    });
  }, []);

  //delete and update state
  useEffect(() => {
    if (deletes !== null) {
      const newObj = tempObjData.filter((p) => deletes._id !== p._id);
      setTempObjData(newObj);
    }
  }, [deletes]);

  const deleteTempObj = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/temp/delete/${objData._id}`);
      socket.current.emit("deleteDest", {
        _id: objData._id,
      });
      toast.success("Location Deleted", {
        duration: 3000,
      });
      setTimeout(function () {
        setConfirm(false);
      }, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const LikeTempObj = async () => {
    try {
      if (type !== "") {
        const res = await axios.put(`/api/temp/like/obj/${objData._id}`, {
          userId: user._id,
          type: type,
        });
        socket.current.emit("setLike", {
          gold: res.data.gold,
          bronze: res.data.bronze,
          silver: res.data.silver,
          wasChosen: res.data.wasChosen,
          isWinner: res.data.isWinner,
          userId: res.data.userId,
          tripId: res.data.tripId,
          label: res.data.label,
          address: res.data.address,
          img: res.data.img,
          url: res.data.url,
          _id: res.data._id,
        });
        toast.success("Nice Vote", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  useEffect(() => {
    if (type !== "") {
      LikeTempObj();
    }
  }, [type]);

  const setFavorite = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/temp/close/voting/${objData._id}`);
      toast.success("Favorite!!", {
        duration: 3000,
      });
      socket.current.emit("setFavorite", {
        gold: res.data.gold,
        bronze: res.data.bronze,
        silver: res.data.silver,
        wasChosen: res.data.wasChosen,
        isWinner: res.data.isWinner,
        userId: res.data.userId,
        tripId: res.data.tripId,
        label: res.data.label,
        address: res.data.address,
        img: res.data.img,
        url: res.data.url,
        _id: res.data._id,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickDest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/temp/choose/obj/${tripId}`, {
        tempId: objData._id,
      });
      setPickOverview(res.data);
      socket.current.emit("setPick", {
        gold: res.data.gold,
        bronze: res.data.bronze,
        silver: res.data.silver,
        wasChosen: res.data.wasChosen,
        isWinner: res.data.isWinner,
        userId: res.data.userId,
        tripId: res.data.tripId,
        label: res.data.label,
        address: res.data.address,
        img: res.data.img,
        url: res.data.url,
        _id: res.data._id,
      });
      setPick(false)
      toast.success("Location picked", {
        duration: 3000,
      });
    } catch (error) {
      console.log(error.message);
    }
  };





  return (
    <div className="obj__main">
      <ConfirmDelete
        confirm={confirm}
        setConfirm={setConfirm}
        deleteTempObj={deleteTempObj}
      />

      {objData.wasChosen === false && (
        <div className="obj__color">
          <div className="obj__info">
            {objData.isWinner === true && (
              <div className="obj__winner">
                <p className="obj__p__winner">Favorite</p>
                <img className="obj__tr__size__winner" src={Gold} alt="" />
              </div>
            )}
            <img
              className="obj__img"
              src={objData.img === "" ? Search : objData.img}
              alt=""
            />
            <p className="obj__address">{objData.address}</p>
            {isAdmin === true ? (
              pick === false ? (
                <button onClick={setFavorite} className="obj__setWinner">
                  {objData.isWinner === false
                    ? "set favotire"
                    : "remover favorite"}
                </button>
              ) : (
                <button className="obj__pick__btn" onClick={pickDest}>
                  Pick Location
                </button>
              )
            ) : (
              ""
            )}
          </div>
          <div className="obj__bottom">
            <a target="_blank" className="obj__map" href={objData?.url}>
              View on Map
            </a>
            {isAdmin === true ? (
              <p className="obj__icon" onClick={() => setConfirm(true)}>
                Delete
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="obj__trophies">
            <div className="obj__troph__n">
              <img
                onClick={() => setType("gold")}
                className="obj__tr__size"
                src={Gold}
                alt=""
              />
              <p>{objData.gold}</p>
            </div>
            <div className="obj__troph__n">
              <img
                onClick={() => setType("silver")}
                className="obj__tr__size"
                src={Silver}
                alt=""
              />
              <p>{objData.silver}</p>
            </div>
            <div className="obj__troph__n">
              <img
                onClick={() => setType("bronze")}
                className="obj__tr__size"
                src={Bronze}
                alt=""
              />
              <p>{objData.bronze}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ConfirmDelete = ({ confirm, setConfirm, deleteTempObj }) => {
  return (
    <>
      {confirm === true && (
        <div className="obj__popup__color">
          <div className="obj__popup__main">
            <div className="obj__popup__info">
              <p className="obj__trip__title">Delete Trip</p>
              <div className="obj__icon__close">
                <AiFillCloseCircle onClick={() => setConfirm(false)} />
              </div>
            </div>
            <p>Are you sure you want to delete this location?</p>
            <div className="obj__bottom__confirm">
              <button
                className="obj__cancel__btn"
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
              <button className="obj__delete__btn" onClick={deleteTempObj}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ObjctList;
