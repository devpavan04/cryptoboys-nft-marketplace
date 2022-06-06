const NFTMarketplace = artifacts.require("NFTMarketplace");
const NFT = artifacts.require("NFT");
const NFTAuction = artifacts.require("NFTAuction");

module.exports = async function(deployer) {
  await deployer.deploy(NFTMarketplace).then(async () => {
    await deployer.deploy(NFTAuction).then(async () => {
      await deployer.deploy(NFT, NFTMarketplace.address, NFTAuction.address);
    });
  });

  console.log("NFTMarketplace deployed to address:", NFTMarketplace.address);
  console.log("NFTAuction deployed to address:", NFTAuction.address);
  console.log("NFT deployed to address:", NFT.address);
};
