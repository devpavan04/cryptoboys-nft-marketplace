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

  describe("Mint and Auction", async () => {
    const price = web3.utils.toWei("1", "Ether");
    const duration = Date.now() + 86400;
    it("allows users to mint ERC721 token", async () => {
      await nft.createToken("myCBNFT", {
        from: accounts[0],
      });
    });

    it("get nft owner", async () => {
      const owner = await nft.ownerOf(tokenId);
      console.log(owner);
    });

    it("create auction", async () => {
      await auction.createTokenAuction(nft.address, tokenId, price, duration, {
        from: accounts[0],
      });
    });

    it("get nft owner", async () => {
      const owner = await nft.ownerOf(tokenId);
      console.log(owner);
    });

    it("1st bid", async () => {
      const price = web3.utils.toWei("10", "Ether");
      await auction.bid(nft.address, tokenId, {
        from: accounts[1],
        value: price,
      });
    });

    it("get balance", async () => {
      const balance = await web3.eth.getBalance(accounts[1]);
      console.log(balance);
    });

    it("excute sale", async () => {
      await auction.executeSale(nft.address, tokenId, {
        from: accounts[0],
      });
    });

    it("get balance", async () => {
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log(balance);
    });

    it("get auction details", async () => {
      const auctionDetails = await auction.getTokenAuctionDetails(
        nft.address,
        tokenId
      );
      console.log(auctionDetails);
    });

    it("get nft owner", async () => {
      const owner = await nft.ownerOf(tokenId);
      console.log(owner);
    });

    it("reapprove smart contract ", async () => {
      await nft.giveResaleApproval(tokenId, {
        from: accounts[1],
      });
    });

    it("create auction", async () => {
      await auction.recreateTokenAuction(
        nft.address,
        tokenId,
        price,
        duration,
        {
          from: accounts[1],
        }
      );
    });

    it("get nft owner", async () => {
      const owner = await nft.ownerOf(tokenId);
      console.log(owner);
    });

    it("1st bid", async () => {
      const price = web3.utils.toWei("2", "Ether");
      await auction.bid(nft.address, tokenId, {
        from: accounts[2],
        value: price,
      });
    });

    it("excute sale", async () => {
      await auction.executeSale(nft.address, tokenId, {
        from: accounts[1],
      });
    });

    it("get nft owner", async () => {
      const owner = await nft.ownerOf(tokenId);
      console.log(owner);
    });

    it("reapprove smart contract ", async () => {
      await nft.giveResaleApproval(tokenId, {
        from: accounts[2],
      });
    });

    it("create auction", async () => {
      await auction.recreateTokenAuction(
        nft.address,
        tokenId,
        price,
        duration,
        {
          from: accounts[2],
        }
      );
    });

    it("get nft owner", async () => {
      const owner = await nft.ownerOf(tokenId);
      console.log(owner);
    });

    it("1st bid", async () => {
      const price = web3.utils.toWei("2", "Ether");
      await auction.bid(nft.address, tokenId, {
        from: accounts[3],
        value: price,
      });
    });

    it("excute sale", async () => {
      await auction.executeSale(nft.address, tokenId, {
        from: accounts[2],
      });
    });

    it("get nft owner", async () => {
      const owner = await nft.ownerOf(tokenId);
      console.log(owner);
    });
  });
});
