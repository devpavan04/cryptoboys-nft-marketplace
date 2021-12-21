import React from "react";
import icon from "./favicon-32x32.png";
import Logo from "./logo-cr-skull-white.png";
import { Link } from "react-router-dom";

const Navbar = ({isAdmin}) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark header">
        <Link to="/" className="navbar-brand ml-2">
          <img src={Logo} alt="CRSkull Logo" className="site-logo"/>
        </Link>
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul
            style={{ fontSize: "0.8rem", letterSpacing: "0.2rem" }}
            className="navbar-nav ml-auto"
          >
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/mint" className="nav-link">
                Mint NFT
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/marketplace" className="nav-link">
                Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-tokens" className="nav-link">
                My Tokens
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/queries" className="nav-link">
                Queries
              </Link>
            </li>
            { isAdmin ?
              <li className="nav-item">
                <Link to="/admin" className="nav-link">
                  Admin Dashboard
                </Link>
              </li>
            : '' }

          </ul>
        </div>
    </nav>
  );
};

export default Navbar;
