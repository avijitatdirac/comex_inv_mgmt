import React from "react";
import LOGO from "../assets/ce_logo.gif";

const Header = props => (
  <div id="header">
    <div className="headerLeft">
      <img src={LOGO} className="topLogo" alt="computer-exchange_logo" />
    </div>
    <div className="headerRight">
      <span>Rental Inventory Management</span>
    </div>
    <div style={{ display: "none" }}>
      <img src={LOGO} alt="computer-exchange_logo" />
    </div>
  </div>
);

export default Header;
