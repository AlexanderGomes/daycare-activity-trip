import React from "react";
import Hero from "../../assets/Globalization.svg";
import budge from "../../assets/budge.svg";
import idea from "../../assets/idea.svg";
import calendar from "../../assets/calendar.svg";
import socialmedia from "../../assets/socialmedia.svg";
import "./Welcome.css";

const Welcome = () => {
  return (
    <div className="wel__main">
      <div className="wel__hero">
        <div className="wel__text">
          <h2 className="wel__h2">Plan the perfect trip with your friends</h2>
          <h3 className="wel__h3">your best moments start here</h3>
          <p className="wel__p">planning your trip makes everything better</p>
          <a href="/c/auth" className="wel__started">
            Get Started
          </a>
        </div>
        <div className="wel__imgs">
          <img className="hero__img" src={Hero} alt="hero image" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
