import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import "./Trip.css";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { logout, reset } from "../../features/auth/authSlice";
import gifDefault from "../../assets/default.gif";
import Maps from "../../assets/map.png";
import { Link, useNavigate } from "react-router-dom";

const Trip = ({ trips, socket }) => {
  const [invitedTrips, setInvitedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedTrip, setUpdatedTrip] = useState(null);
  const [file, setFile] = useState();
  const [popUp, setPopUp] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userNotFound = "Request failed with status code 302";

  useEffect(() => {
    if (!user) {
      navigate("/c/auth");
    }

    if (user.id) {
      dispatch(logout());
      dispatch(reset());
      navigate("/c/auth");
    }

    if (user) {
      const getUser = async () => {
        axios.get(`/api/user/verify/new/${user._id}`).catch((error) => {
          if (error.message === userNotFound) {
            dispatch(logout());
            dispatch(reset());
            navigate("/c/auth");
          }
        });
      };
      getUser();
    }
  }, []);

  //handle post state
  const formik = useFormik({
    initialValues: {
      name: "",
      desc: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      desc: Yup.string().required("desc is required"),
    }),
  });

  //size of the file may delay the request
  const HandlePost = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");

    try {
      if (file) {
        try {
          setIsLoading(true);
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/ddphqky8w/image/upload",
            data
          );
          const { url } = uploadRes.data;
          const TripWithImg = {
            userId: user._id,
            name: formik.values.name,
            desc: formik.values.desc,
            img: url,
          };
          await axios.post("/api/trip", TripWithImg);
          toast.success("Schedule Created", {
            duration: 3000,
          });
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        } catch (err) {
          console.log(err.message);
        }
      } else {
        const newTrip = {
          userId: user._id,
          name: formik.values.name,
          desc: formik.values.desc,
        };

        setIsLoading(true);
        await axios.post("/api/trip", newTrip);
        toast.success("Schedule Created", {
          duration: 3000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getInvitedTo = async () => {
    try {
      const res = await axios.get(`/api/user/get/byId/${user._id}`);
      setInvitedTrips(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getInvitedTo();
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getChange", (data) => {
        setData({
          _id: data._id,
          name: data.name,
          email: data.email,
          invitations: data.invitations,
          invitedTo: data.invitedTo,
        });
      });
    }
  }, []);

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
    if (data !== null || updatedTrip !== null) {
      getInvitedTo();
    }
  }, [data, updatedTrip]);

  return (
    <div className="trip__main">
      {popUp === true ? (
        <div className="trip__popup__color">
          <div className="trip__popup__main">
            <div className="trip__popup__info">
              <p className="trip__title">Create Trip</p>
              <div className="icon__close">
                <AiFillCloseCircle onClick={() => setPopUp(false)} />
              </div>
            </div>
            <div className="trip__popup__inputs">
              <div>
                <p className="inputs__labels">
                  Trip's name <span>(required)</span>
                </p>
                <input
                  className="input__popup"
                  type="text"
                  placeholder="exp: Disney trip"
                  id="name"
                  name="name"
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className="error__popup">{formik.errors.name}</p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <p className="inputs__labels">
                  Trip's img <span>(optional)</span>
                </p>
                <input
                  className="file__hidden"
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg,Screenshot"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label className="label__btn" for="file">
                  Choose image
                </label>
                {file ? (
                  <div className="popup__file__check">
                    <p>file choosen</p>
                    <AiFillCheckCircle />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <button className="popup__submit__btn" onClick={HandlePost}>
                {isLoading === true ? "loading..." : "submit"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="trip__top">
        <p className="tip__create__text">Start Your Trip</p>
        <p className="tip__create__slogan">
          memories for the rest of your life start here.
        </p>
        <button onClick={() => setPopUp(true)} className="tip__create__btn">
          create
        </button>
      </div>
      <div className="trip__bottom">
        {trips.length > 0 || invitedTrips.length > 0 ? (
          <>
            <Trips trips={trips} />
            <InvitedTrips invitedTrips={invitedTrips} />
          </>
        ) : (
          <div className="trip__empty">
            <p className="trip__p">
              You have no trips right now it's time to change that
            </p>
            <img className="empty__img" src={Maps} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

const Trips = ({ trips }) => {
  return (
    <>
      {trips.map((trip) => (
        <div>
          <p className="trip__data__name">{trip.name}</p>
          <Link to={`/c/trip/edit/${trip._id}`}>
            <div key={trip._id} className="trip__data__main">
              <img
                className="trip__data__img"
                src={trip.img ? trip.img : gifDefault}
                alt="trip's img"
              />
            </div>
          </Link>
          <a className="trip__redirect" href={`/c/trip/edit/${trip._id}`}>
            Start Editing
          </a>
        </div>
      ))}
    </>
  );
};

const InvitedTrips = ({ invitedTrips }) => {
  return (
    <>
      {invitedTrips.map((trip) => (
        <div>
          <p className="trip__data__name">{trip.name}</p>
          <Link to={`/c/trip/edit/${trip._id}`}>
            <div key={trip._id} className="trip__data__main">
              <p className="invited__top">invited</p>
              <img
                className="trip__data__img"
                src={trip.img ? trip.img : gifDefault}
                alt="trip's img"
              />
            </div>
          </Link>
          <a className="trip__redirect" href={`/c/trip/edit/${trip._id}`}>
            Start Editing
          </a>
        </div>
      ))}
    </>
  );
};

export default Trip;
