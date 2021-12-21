import React from "react";
import './AccountDetails.css';

const AccountDetails = ({ accountAddress, accountBalance }) => {
  return (
      <div className="container ac-home">
        <h1 className="ac-title">CroSkull NFT Marketplace</h1>
        <p className="ac-text">
          This is an NFT marketplace where you can mint ERC721 implemented{" "}
          <i>CroSkull NFTs</i> and manage them.
        </p>
        <hr className="my-4" />
        <p className="ac-text">Account address :</p>
        <h4 className="ac-text">{accountAddress}</h4>
        <p className="ac-text">Account balance :</p>
        <h4 className="ac-text">{accountBalance} Ξ</h4>
      </div>
  );
};

export default AccountDetails;
