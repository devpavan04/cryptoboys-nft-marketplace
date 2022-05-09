const NFTMarketplace = artifacts.require("NFTMarketplace");
const NFT = artifacts.require("NFT");

module.exports = async function(deployer) {
  await deployer.deploy(NFTMarketplace).then(async () => {
    await deployer.deploy(NFT, NFTMarketplace.address);
  });

  console.log("NFTMarketplace deployed to address:", NFTMarketplace.address);
  console.log("NFT deployed to address:", NFT.address);
};
