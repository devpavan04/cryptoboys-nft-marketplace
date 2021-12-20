import React, { useState, useEffect } from "react";


const CryptoBoyNFTImage = ({ imageURI }) => {
  console.log(imageURI)
  imageURI = imageURI.replace('ipfs://', '')
  imageURI = imageURI.split('/')
  imageURI = `https://infura-ipfs.io/ipfs/${imageURI[0]}/${imageURI[1]}`
  console.log( imageURI)
  return (
    <div>
        <img src={imageURI} className="NFT-image" />
    </div>
  );
};

export default CryptoBoyNFTImage;
