import NFTMarketplace from "./build/abis/NFTMarketplace.json";
import NFTAuction from "./build/abis/NFTAuction.json";
import NFT from "./build/abis/NFT.json";
import { ethers } from "ethers";

export const getNFTContract = () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
    const nftContract = new ethers.Contract(contractAddress, NFT.abi, signer);

    return nftContract;
  }
};

export const getMarketplaceContract = () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS;
    const marketplaceContract = new ethers.Contract(
      contractAddress,
      NFTMarketplace.abi,
      signer
    );

    return marketplaceContract;
  }
};

export const getAuctionContract = () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = process.env.REACT_APP_AUCTION_CONTRACT_ADDRESS;
    const auctionContract = new ethers.Contract(
      contractAddress,
      NFTAuction.abi,
      signer
    );

    return auctionContract;
  }
};
