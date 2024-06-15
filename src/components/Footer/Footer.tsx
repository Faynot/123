import React from "react";
import logo from "../../../public/by.png";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
   <div className="Footer-Container-Main">
    <footer className="footer">
      <div className="footer-content">
        <img src={logo} alt="Logo" className="footer-logo" />
        <ul className="footer-links">
          <li>
            <a href="https://www.donationalerts.com/r/inf_tech">donate</a>
          </li>
          <li>
            <a href="/info">info</a>
          </li>
          <li>
            <a href="https://github.com/Faynot">github</a>
          </li>
        </ul>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
