import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer__main">
      <div className="footer__info">
        <p className="footer__p">Social Trip</p>
        <p className="footer__message">
          The best place to create great moments.
        </p>
        <p className="">Contact us at <a target="_blank" href="mailto:socialtripmain@gmail.com">socialtripmain@gmail.com</a></p>
        <p className="footer__message">
          Copyright © 2022 Social Trip All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
