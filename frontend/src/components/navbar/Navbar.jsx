import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { Notification } from "../";
import Empty from "../../assets/noti.svg";
import "./Navbar.css";

const Navbar = ({ socket, notiData }) => {
  const [toggle, setToggle] = useState(false);
  const [toggleNoti, setToggleNoti] = useState(false);

  const close = () => {
    setToggle(false);
  };

  const NotiClose = () => {
    setToggleNoti(false);
  };

  useEffect(() => {
    if (toggle === true) {
      document.body.classList.add("stop__scroll");
    } else {
      document.body.classList.remove("stop__scroll");
    }
  }, [toggle]);

  return (
    <div className="color__nav">
      <div className="navbar__logo">
        <p className="navbar__slogan">Social Trip</p>
      </div>
      <div className="navbar__main">
        <div className="navbar__icons">
          <ul className="navbar__icons__ul">
            <li>
              <a style={{ textDecoration: "none" }} href={"/c/trip"}>
                <span className="navbar__history color">Trip</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="navbar__noti">
          <IoMdNotifications
            size={25}
            className="noti__icon"
            onClick={() => setToggleNoti(true)}
          />
          <span onClick={() => setToggleNoti(true)} className="span__noti">
            {notiData.length}
          </span>
        </div>
        <div className="open__icon">
          <GiHamburgerMenu onClick={() => setToggle(true)} />
        </div>
        <div className="toggle__nav">
          <PhoneNav toggle={toggle} close={close} />
          <NotiNav
            close={NotiClose}
            toggle={toggleNoti}
            notiData={notiData}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
};

const NotiNav = ({ close, toggle, notiData, socket }) => {
  return (
    <>
      {toggle && (
        <div className="toggle__color">
          <div className="toggle__main">
            <div className="toggle__top">
              <p className="slogan__toggle">Social Trip</p>
              <AiFillCloseCircle
                onClick={close}
                color="rgb(180, 180, 67)"
                className="close__icon"
              />
            </div>
            <div className="toggle__icons">
              {notiData.length > 0 ? (
                notiData.map((data) => (
                  <div key={data._id}>
                    <Notification socket={socket} data={data} />
                  </div>
                ))
              ) : (
                <div>
                  <div className="desc__nodata">
                    <p className="desc__nodata__p">
                      <a className="desc__nodata__a" href="/c/trip">
                        Check Trips
                      </a>
                    </p>
                    <img className="desc__nodata__img" src={Empty} alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PhoneNav = ({ toggle, close }) => {
  return (
    <>
      {toggle && (
        <div className="toggle__color">
          <div className="toggle__main">
            <div className="toggle__top">
              <p className="slogan__toggle">Social Trip</p>
              <AiFillCloseCircle
                onClick={close}
                color="rgb(180, 180, 67)"
                className="close__icon"
              />
            </div>
            <div className="toggle__icons">
              <ul className="toggle__icons__ul">
                <li>
                  <a style={{ textDecoration: "none" }} href={"/c/trip"}>
                    <span className="navbar__history color" onClick={close}>
                      Trip
                      <p className="toggle__details">
                        Plan your trips with friends, or by yourself and just
                        send them the plan
                      </p>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
