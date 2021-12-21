import React, { useState, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';


const CryptoBoyNFTImage = ({ imageURI }) => {
  imageURI = imageURI.replace('ipfs://', '')
  imageURI = imageURI.split('/')
  imageURI = `https://infura-ipfs.io/ipfs/${imageURI[0]}/${imageURI[1]}`

  return (
    <div>
        <LazyLoadImage 
          src={imageURI} className="NFT-image" 
        />
    </div>
  );
};

export default CryptoBoyNFTImage;
