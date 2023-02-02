// trivial
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

// images // icons // css
import { AiFillCloseCircle } from "react-icons/ai";
import Empty from "../../assets/resort.png";
import Search from "../../assets/Search-pana.svg";
import { toast } from "react-hot-toast";
import "./Destination.css";
import { KEY } from "../../../../config";
// components
import { ObjctList } from "../../components";

// voting plan

// pass tempObj to the voting function
const Destination = ({
  tripId,
  currentLabel,
  socket,
  setPickOverview,
  pickOverview,
  isAdmin,
  active,
}) => {
  const [popUp, setPopUp] = useState(false);
  const [info, setInfo] = useState([]);
  const [tempObjData, setTempObjData] = useState([]);
  const [favoriteNewState, setFavoriteNewState] = useState(null);
  const [pickNewState, setPickNewState] = useState(null);
  const [likesNewState, setLikesNewState] = useState(null);
  const [tripData, setTripData] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [pick, setPick] = useState(false);
  const [arrival, setArrival] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const [ libraries ] = useState(['places']);



  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const autoCompleteRef = useRef();
  const inputRef = useRef();

  const mountApp = () => {
    if (window.google) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current
      );

      autoCompleteRef.current.addListener("place_changed", async function () {
        const place = await autoCompleteRef.current.getPlace();
        setInfo({
          name: place.formatted_address,
          photos: place?.photos?.length > 0 ? place.photos[0].getUrl() : "",
          url: place.url,
        });
      });
    }
  };

  // server requests
  const getTemObjs = async () => {
    try {
      const res = await axios.get(
        `/api/temp/get/obj/data/${tripId}/${currentLabel}`
      );
      setTempObjData(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } catch (error) {
      console.log(error.messgae);
    }
  };

  const getTripById = async () => {
    const res = await axios.get(`/api/trip/byId/${tripId}`);
    setTripData(res.data);
  };

  useEffect(() => {
    let allowedUsers = [];
    if (tripData) {
      tripData.admins?.map((us) => {
        allowedUsers.push(us);
      });

      tripData.travelers?.map((us) => {
        allowedUsers.push(us);
      });
    }

    setAllowedUsers(allowedUsers);
  }, [tripData]);

  const postDestinationTempObj = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/api/temp/`, {
        userId: user._id,
        tripId: tripId,
        label: currentLabel,
        address: info.name,
        img: info.photos,
        url: info.url,
      });

      socket.current.emit("createDest", {
        userId: user._id,
        tripId: tripId,
        label: currentLabel,
        address: info.name,
        img: info.photos,
        url: info.url,
        _id: res.data._id,
      });

      toast.success("destination suggested", {
        duration: 3000,
      });
      setInfo([]);
      setPopUp(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTemObjs();
    getTripById();
  }, []);

  //sending updated data for allowed users
  useEffect(() => {
    if (arrival !== null) {
      allowedUsers.filter((id) => {
        if (id === user._id) {
          getTemObjs();
        }
      });
    }
  }, [arrival]);

  useEffect(() => {
    socket.current.on("getDest", (data) => {
      setArrival({
        userId: data.userId,
        tripId: data.tripId,
        label: data.label,
        address: data.address,
        img: data.img,
        url: data.url,
        _id: data._id,
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("getFavorite", (data) => {
      setFavoriteNewState({
        gold: data.gold,
        bronze: data.bronze,
        silver: data.silver,
        wasChosen: data.wasChosen,
        isWinner: data.isWinner,
        userId: data.userId,
        tripId: data.tripId,
        label: data.label,
        address: data.address,
        img: data.img,
        url: data.url,
        _id: data._id,
      });
    });
  }, []);
  useEffect(() => {
    socket.current.on("getLike", (data) => {
      setLikesNewState({
        gold: data.gold,
        bronze: data.bronze,
        silver: data.silver,
        wasChosen: data.wasChosen,
        isWinner: data.isWinner,
        userId: data.userId,
        tripId: data.tripId,
        label: data.label,
        address: data.address,
        img: data.img,
        url: data.url,
        _id: data._id,
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("getPick", (data) => {
      setPickNewState({
        gold: data.gold,
        bronze: data.bronze,
        silver: data.silver,
        wasChosen: data.wasChosen,
        isWinner: data.isWinner,
        userId: data.userId,
        tripId: data.tripId,
        label: data.label,
        address: data.address,
        img: data.img,
        url: data.url,
        _id: data._id,
      });
    });
  }, []);

  useEffect(() => {
    if (favoriteNewState !== null) {
      allowedUsers.filter((id) => {
        if (id === user._id) {
          getTemObjs();
        }
      });
    }
  }, [favoriteNewState]);

  useEffect(() => {
    if (pickNewState !== null) {
      allowedUsers.filter((id) => {
        if (id === user._id) {
          getTemObjs();
        }
      });
    }
  }, [pickNewState]);

  useEffect(() => {
    if (likesNewState !== null) {
      allowedUsers.filter((id) => {
        if (id === user._id) {
          getTemObjs();
        }
      });
    }
  }, [likesNewState]);



  if (!isLoaded) {
    return <p>loading....</p>;
  }

  return (
    <div className="dest__main">
      <div className="dest__info">
        {isAdmin === true ? (
          <p className="dest__intro__p">
            Start suggesting locations by cliking on the "add" button, Define
            destination clicking 'Pick'
          </p>
        ) : (
          ""
        )}
      </div>
      {isAdmin === true ? (
        <div className="desc__bottom__top">
          <button className="desc__bottom__btn" onClick={() => setPopUp(true)}>
            add
          </button>
          <button className="desc__bottom__btn" onClick={() => setPick(true)}>
            pick
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="desc__bottom">
        <div className="desc__bottom__data">
          {tempObjData?.length > 0 ? (
            <div className="dest__bottom__main">
              {tempObjData.map((obj) => (
                <div key={obj._id}>
                  <ObjctList
                    objData={obj}
                    pick={pick}
                    tripId={tripId}
                    key={obj._id}
                    setTempObjData={setTempObjData}
                    tempObjData={tempObjData}
                    socket={socket}
                    setPick={setPick}
                    setPickOverview={setPickOverview}
                    pickOverview={pickOverview}
                    isAdmin={isAdmin}
                    allowedUsers={allowedUsers}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="desc__nodata">
              <p className="desc__nodata__p">
                {isAdmin === true
                  ? "Start making suggestions"
                  : "No location added"}
              </p>
              <img
                loading="lazy"
                className="desc__nodata__img"
                src={Empty}
                alt=""
              />
            </div>
          )}
        </div>
      </div>

      <div className="dest__popup">
        <LocationPopup
          popUp={popUp}
          setPopUp={setPopUp}
          inputRef={inputRef}
          mountApp={mountApp}
          info={info}
          postDestinationTempObj={postDestinationTempObj}
        />
        <PickList
          pick={pick}
          setPick={setPick}
          tempObjData={tempObjData}
          tripId={tripId}
          setTempObjData={setTempObjData}
          socket={socket}
          setPickOverview={setPickOverview}
          pickOverview={pickOverview}
          isAdmin={isAdmin}
          allowedUsers={allowedUsers}
        />
      </div>
    </div>
  );
};

const PickList = ({
  pick,
  setPick,
  tempObjData,
  tripId,
  setTempObjData,
  socket,
  setPickOverview,
  pickOverview,
  isAdmin,
  allowedUsers,
}) => {
  return (
    <div>
      {pick == true && (
        <div className="pick__popup__color">
          <div className="pick__popup__main">
            <div className="dest__popup__info">
              <p className="dest__title">Choose Destination</p>
              <div className="icon__close">
                <AiFillCloseCircle onClick={() => setPick(false)} />
              </div>
            </div>
            <div className="desc__bottom__data">
              {tempObjData?.length > 0 ? (
                <div className="dest__bottom__main">
                  {tempObjData.map((obj) => (
                    <div key={obj._id}>
                      <ObjctList
                        objData={obj}
                        pick={pick}
                        tripId={tripId}
                        setTempObjData={setTempObjData}
                        setPick={setPick}
                        tempObjData={tempObjData}
                        socket={socket}
                        setPickOverview={setPickOverview}
                        pickOverview={pickOverview}
                        isAdmin={isAdmin}
                        allowedUsers={allowedUsers}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="desc__nodata">
                  <p className="desc__nodata__p">Nothing to Choose</p>
                  <img className="desc__nodata__img" src={Empty} alt="" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LocationPopup = ({
  popUp,
  setPopUp,
  inputRef,
  mountApp,
  info,
  postDestinationTempObj,
}) => {
  return (
    <>
      {popUp == true && (
        <div className="dest__popup__color">
          <div className="dest__popup__main">
            <div className="dest__popup__info">
              <p className="dest__title">Social Trip</p>
              <div className="icon__close">
                <AiFillCloseCircle onClick={() => setPopUp(false)} />
              </div>
            </div>

            <div className="dest__popup__bottom">
              <p className="dest__popup__bottom__p">
                Suggest a destination for your upcoming trip
              </p>
              <Autocomplete>
                <input
                  className="dest__input__popup"
                  type="text"
                  placeholder="Rio de Janeiro, Brazil"
                  id="address"
                  name="address"
                  ref={inputRef}
                  onClick={mountApp}
                />
              </Autocomplete>
              <img
                className="img__google"
                src={info.photos === "" || !info.photos ? Search : info.photos}
                alt="google maps pictures"
              />
              <button
                className="dest__btn__add"
                onClick={postDestinationTempObj}
              >
                Add Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Destination;
