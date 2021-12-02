import React, { useEffect } from "react";
import metamaskIcon from "./metamask.svg";

const ConnectToMetamask = ({ connectToMetamask }) => {
  

  return (
    <div className="jumbotron">
      <h1 className="display-5">
        CRSkull NFT Marketplace
      </h1>
      <p className="lead">
        Access CRSkull Metaverse
      </p>
      <hr className="my-4" />
      <button
        onClick={connectToMetamask}
        className="btn btn-primary d-flex align-items-center"
        style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
      >
        Connect Metamask{" "}
        <img
          src={metamaskIcon}
          alt="metamask-icon"
          style={{ width: "2rem", marginLeft: "0.5rem" }}
        />
      </button>
    </div>
  );
};

export default ConnectToMetamask;
