const { assert } = require("chai");
// Test run command: truffle test test/auction.test.js --compile-none
// duration is in seconds
// Calculate duration : const blockDuration = Math.floor(new Date().getTime() / 1000) + duration;

const NFT = artifacts.require("./NFT.sol");
const NFTMarkeplace = artifacts.require("./NFTMarketplace.sol");
const NFTAuction = artifacts.require("./NFTAuction.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Auction", async (accounts) => {
  let nft, marketplace, auction, listingPrice;
  const zero_address = "0x0000000000000000000000000000000000000000";
  const tokenId = 1;

  before(async () => {
    marketplace = await NFTMarkeplace.deployed();
    auction = await NFTAuction.deployed();
    nft = await NFT.deployed(marketplace.address, auction.address);
  });

  console.log("Account 0: ", accounts[0]);
  console.log("Account 1: ", accounts[1]);

  describe("basic mint features", async () => {
    it("allows users to mint ERC721 token", async () => {
      await nft.createToken("myCBNFT", {
        from: accounts[0],
      });
    });

    it("get listing price", async () => {
      listingPrice = await marketplace.getListingPrice();
      console.log(listingPrice);
    });

    it("returns address of the token's owner", async () => {
      const tokenOwner = await nft.ownerOf(tokenId);
      assert.equal(tokenOwner, accounts[0]);
    });
  });

  describe("Mint and Auction", async () => {
    const price = web3.utils.toWei("1", "Ether");
    const duration = Date.now() + 86400 * 1000;
    it("allows users to mint ERC721 token", async () => {
      await nft.createToken("myCBNFT", {
        from: accounts[0],
      });
    });

    it("create auction", async () => {
      await auction.createTokenAuction(nft.address, tokenId, price, duration, {
        from: accounts[0],
      });
    });

    it("get auction detail", async () => {
      const auctionDetail = await auction.getTokenAuctionDetails(
        nft.address,
        tokenId
      );
      console.log(auctionDetail);
    });

    it("1st bid", async () => {
      const price = web3.utils.toWei("2", "Ether");
      auction.bid(nft.address, tokenId, {
        from: accounts[1],
        value: price,
      });
    });

    it("2nd bid", async () => {
      const price = web3.utils.toWei("3", "Ether");
      await auction.bid(nft.address, tokenId, {
        from: accounts[2],
        value: price,
      });
    });

    it("3rd bid", async () => {
      const price = web3.utils.toWei("4", "Ether");
      await auction.bid(nft.address, tokenId, {
        from: accounts[3],
        value: price,
      });
    });

    it("get auction detail after bid", async () => {
      const auctionDetail = await auction.getTokenAuctionDetails(
        nft.address,
        tokenId
      );
      console.log(auctionDetail);
    });

    it("execute sale", async () => {
      await auction.executeSale(nft.address, tokenId, {
        from: accounts[0],
      });
    });

    it("get new token owner", async () => {
      const tokenOwner = await nft.ownerOf(tokenId);
      assert.equal(tokenOwner, accounts[3]);
    });
  });
});
