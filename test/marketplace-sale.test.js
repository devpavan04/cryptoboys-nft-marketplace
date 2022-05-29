const { assert } = require("chai");

const NFT = artifacts.require("./NFT.sol");
const NFTMarkeplace = artifacts.require("./NFTMarketplace.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Marketplace", async (accounts) => {
  let nft, marketplace, listingPrice;
  const zero_address = "0x0000000000000000000000000000000000000000";

  before(async () => {
    marketplace = await NFTMarkeplace.deployed();
    nft = await NFT.deployed(marketplace.address);
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
      const tokenOwner = await nft.ownerOf(1);
      assert.equal(tokenOwner, accounts[0]);
    });
  });

  describe("application features", async () => {
    it("allows users to mint ERC721 token", async () => {
      await nft.createToken("myCBNFT", {
        from: accounts[0],
      });
    });

    it("returns the token's URI", async () => {
      const tokenURI = await nft.tokenURI(1);
      assert.equal(tokenURI, "myCBNFT");
    });

    //Account 0 is the owner of the token and Account 1 is the buyer
    it("creat marketplace item and create market sale", async () => {
      const price = web3.utils.toWei("1", "Ether");
      await marketplace.createMarketplaceItem(nft.address, 1, price, {
        value: listingPrice,
      });

      await marketplace.createMarketplaceSale(nft.address, 1, {
        value: price,
        from: accounts[1],
      });
    });

    it("returns address of the new token's owner", async () => {
      const tokenOwner = await nft.ownerOf(1);
      assert.equal(tokenOwner, accounts[1]);
    });

    //Token owner : Account 1
    it("reapprove smart contract 1st", async () => {
      await nft.giveResaleApproval(1, {
        from: accounts[1],
      });
    });

    //Account 1 is the owner of the token and Account 0 is the buyer
    it("resell the token and create marketsale 1st", async () => {
      const price = web3.utils.toWei("1", "Ether");
      await marketplace.resellToken(nft.address, 1, price, {
        value: listingPrice,
        from: accounts[1],
      });

      await marketplace.createMarketplaceSale(nft.address, 1, {
        value: price,
        from: accounts[0],
      });
    });

    //Token owner : Account 0
    it("reapprove smart contract 2nd", async () => {
      await nft.giveResaleApproval(1, {
        from: accounts[0],
      });
    });

    //Account 0 is the owner of the token and Account 2 is the buyer
    it("resell the token and create marketsale 2nd", async () => {
      const price = web3.utils.toWei("1", "Ether");

      await marketplace.resellToken(nft.address, 1, price, {
        value: listingPrice,
        from: accounts[0],
      });

      await marketplace.createMarketplaceSale(nft.address, 1, {
        value: price,
        from: accounts[2],
      });
    });

    //Token owner : Account 2
    it("reapprove smart contract 3rd", async () => {
      await nft.giveResaleApproval(1, {
        from: accounts[2],
      });
    });

    //Account 2 is the owner of the token and Account 1 is the buyer
    it("resell the token and create marketsale 3rd", async () => {
      const price = web3.utils.toWei("1", "Ether");
      await marketplace.resellToken(nft.address, 1, price, {
        value: listingPrice,
        from: accounts[2],
      });

      await marketplace.createMarketplaceSale(nft.address, 1, {
        value: price,
        from: accounts[1],
      });
    });

    // // returns tokenURI of the token
    // it("returns metadata of a token", async () => {
    //   const tokenMetaData = await cryptoBoys.getTokenMetaData(2);
    //   assert.equal(
    //     tokenMetaData,
    //     "https://gateway.pinata.cloud/ipfs/QmYFmJgQGH4uPQRYN15Xdv4aLd9o4Aq63y1e4GgN6kj5aK/2"
    //   );
    // });

    // it("returns total number of tokens minted so far", async () => {
    //   const totalNumberOfTokensMinted = await cryptoBoys.getNumberOfTokensMinted();
    //   assert.equal(totalNumberOfTokensMinted.toNumber(), 4);
    // });

    // it("returns total number of tokens owned by an address", async () => {
    //   const totalNumberOfTokensOwnedByAnAddress = await cryptoBoys.getTotalNumberOfTokensOwnedByAnAddress(
    //     accounts[0]
    //   );
    //   assert.equal(totalNumberOfTokensOwnedByAnAddress.toNumber(), 3);
    // });

    // it("allows users to buy token for specified ethers", async () => {
    //   const oldTokenOwner = await cryptoBoys.getTokenOwner(1);
    //   assert.equal(oldTokenOwner, accounts[0]);

    //   let oldTokenOwnerBalance;
    //   oldTokenOwnerBalance = await web3.eth.getBalance(accounts[0]);
    //   oldTokenOwnerBalance = new web3.utils.BN(oldTokenOwnerBalance);

    //   let oldTotalNumberOfTokensOwnedBySeller;
    //   oldTotalNumberOfTokensOwnedBySeller = await cryptoBoys.getTotalNumberOfTokensOwnedByAnAddress(
    //     accounts[0]
    //   );
    //   assert.equal(oldTotalNumberOfTokensOwnedBySeller.toNumber(), 3);

    //   let cryptoBoy;
    //   cryptoBoy = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(cryptoBoy.numberOfTransfers.toNumber(), 0);

    //   result = await cryptoBoys.buyToken(1, {
    //     from: accounts[2],
    //     value: web3.utils.toWei("1", "Ether"),
    //   });

    //   const newTokenOwner = await cryptoBoys.getTokenOwner(1);
    //   assert.equal(newTokenOwner, accounts[2]);

    //   let newTokenOwnerBalance;
    //   newTokenOwnerBalance = await web3.eth.getBalance(accounts[0]);
    //   newTokenOwnerBalance = new web3.utils.BN(newTokenOwnerBalance);

    //   let newTotalNumberOfTokensOwnedBySeller;
    //   newTotalNumberOfTokensOwnedBySeller = await cryptoBoys.getTotalNumberOfTokensOwnedByAnAddress(
    //     accounts[0]
    //   );
    //   assert.equal(newTotalNumberOfTokensOwnedBySeller.toNumber(), 2);

    //   cryptoBoy = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(cryptoBoy.numberOfTransfers.toNumber(), 1);

    //   let price;
    //   price = web3.utils.toWei("1", "Ether");
    //   price = new web3.utils.BN(price);

    //   const exepectedBalance = oldTokenOwnerBalance.add(price);
    //   assert.equal(
    //     newTokenOwnerBalance.toString(),
    //     exepectedBalance.toString()
    //   );

    //   cryptoBoy = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(cryptoBoy.currentOwner, accounts[2]);

    //   await cryptoBoys.buyToken(2, {
    //     from: 0x0000000000000000000000000000000000000000,
    //     value: web3.utils.toWei("1", "Ether"),
    //   }).should.be.rejected;

    //   await cryptoBoys.buyToken(56, {
    //     from: accounts[4],
    //     value: web3.utils.toWei("1", "Ether"),
    //   }).should.be.rejected;

    //   await cryptoBoys.buyToken(3, {
    //     from: accounts[0],
    //     value: web3.utils.toWei("1", "Ether"),
    //   }).should.be.rejected;
    // });

    // it("allows users to change token price", async () => {
    //   let cryptoBoyPrice;
    //   cryptoBoyPrice = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(web3.utils.fromWei(cryptoBoyPrice.price, "ether"), 1);

    //   result = await cryptoBoys.changeTokenPrice(
    //     1,
    //     web3.utils.toWei("2", "Ether"),
    //     {
    //       from: accounts[2],
    //     }
    //   );

    //   cryptoBoyPrice = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(web3.utils.fromWei(cryptoBoyPrice.price, "ether"), 2);

    //   await cryptoBoys.changeTokenPrice(1, web3.utils.toWei("3", "Ether"), {
    //     from: 0x0000000000000000000000000000000000000000,
    //   }).should.be.rejected;

    //   await cryptoBoys.changeTokenPrice(82, web3.utils.toWei("3", "Ether"), {
    //     from: accounts[2],
    //   }).should.be.rejected;

    //   await cryptoBoys.changeTokenPrice(1, web3.utils.toWei("3", "Ether"), {
    //     from: accounts[6],
    //   }).should.be.rejected;
    // });

    // it("allows users to toggle between setting the token for sale or not for sale", async () => {
    //   let cryptoboy;
    //   cryptoboy = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(cryptoboy.forSale, true);

    //   result = await cryptoBoys.toggleForSale(1, { from: accounts[2] });

    //   cryptoboy = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(cryptoboy.forSale, false);

    //   result = await cryptoBoys.toggleForSale(1, { from: accounts[2] });

    //   cryptoboy = await cryptoBoys.allCryptoBoys(1, {
    //     from: accounts[0],
    //   });
    //   assert.equal(cryptoboy.forSale, true);

    //   await cryptoBoys.toggleForSale(1, {
    //     from: 0x0000000000000000000000000000000000000000,
    //   }).should.be.rejected;

    //   await cryptoBoys.toggleForSale(94, { from: accounts[2] }).should.be
    //     .rejected;

    //   await cryptoBoys.toggleForSale(1, { from: accounts[8] }).should.be
    //     .rejected;
    // });
  });
});
