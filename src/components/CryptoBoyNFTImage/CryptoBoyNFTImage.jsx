import React, { useState, useEffect } from "react";

const CryptoBoyNFTImage = ({ imageURI }) => {
  return (
    <div>
      <img src={imageURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} className="NFT-image" />
    </div>
  );
};

export default CryptoBoyNFTImage;
