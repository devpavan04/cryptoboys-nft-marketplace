import React, { Fragment } from "react";
import icon from "./favicon-32x32.png";
import { Link } from "react-router-dom";
import { Input, Space } from "antd";

const Navbar = (props) => {
  return (
    <nav
      style={{
        boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
      }}
      className="navbar navbar-expand-sm navbar-dark"
    >
      <div className="w-100 row pl-2 pr-2">
        <div className="col-3">
          <Link to="/">
            <img
              style={{ width: "50px" }}
              className="mr-4"
              src={"https://opensea.io/static/images/logos/opensea.svg"}
              alt=""
            />
            <span className="h4 font-weight-bold">Crypto boyz</span>
          </Link>
        </div>
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="col-2 pt-2">
          <Input.Search placeholder="Search items, collections and accounts" />
        </div>
        <div
          id="navbarNav"
          className="collapse navbar-collapse pt-2 col-12 col-lg-7"
          ref={(element) => {
            return (
              element &&
              element.style.setProperty("display", "inline-block", "important")
            );
          }}
        >
          <ul
            style={{ fontSize: "0.8rem", letterSpacing: "0.2rem" }}
            className="navbar-nav ml-auto float-right"
          >
            <li className="mr-3">
              <Link to="/explore" className="">
                Explore
              </Link>
            </li>
            <li className="mr-3">
              <Link to="/mint" className="">
                Mint NFT
              </Link>
            </li>
            <li className="mr-3">
              <Link to="/assets" className="">
                Assets
              </Link>
            </li>
            <li className="mr-3">
              <Link to="/marketplace" className="">
                Marketplace
              </Link>
            </li>
            {/* <li className="mr-3">
              <Link to="/my-tokens" className="">
                My Tokens
              </Link>
            </li> */}
            {/* <li className="mr-3">
              <Link to="/queries" className="">
                Queries
              </Link>
            </li> */}
            {!props.auth ? (
              <li className="mr-3">
                <Link to="/login" className="">
                  Login
                </Link>
              </li>
            ) : (
              <Fragment>
                <li className="mr-3">
                  <Link to="/my-account" className="">
                    Account
                  </Link>
                </li>
                <li className="mr-3">
                  <Link to="/settings" className="">
                    Settings
                  </Link>
                </li>
              </Fragment>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
