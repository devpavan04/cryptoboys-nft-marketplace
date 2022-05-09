var ethers = require("ethers");

describe("Create Marketplace Smart Contract", function() {
  it("Should create Marketplace Smart Contract", async function() {
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    await Marketplace.deploy();
  });
});
