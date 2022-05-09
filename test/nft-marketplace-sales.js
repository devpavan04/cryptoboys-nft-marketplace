var ethers = require("ethers");

describe("NFT <-> Marketplace sales", function() {
  it("Should create and execute marketplace sales", async function() {
    // deploy the Marketplace contract
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();
    const marketplaceAddress = marketplace.address;

    // deploy the NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketplaceAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await marketplace.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("2", "ether");

    // create two tokens
    await nft.createToken("https://www.token-location-on-ipfs.com");
    await nft.createToken("https://www.token-location-on-ipfs-2.com");

    // put both tokens for sale
    await marketplace.createMarketplaceItem(
      nftContractAddress,
      1,
      auctionPrice,
      {
        value: listingPrice,
      }
    );
    await marketplace.createMarketplaceItem(
      nftContractAddress,
      2,
      auctionPrice,
      {
        value: listingPrice,
      }
    );

    const [_, buyerAddress] = await ethers.getSigners();

    // execute sale of token to another user
    await marketplace
      .connect(buyerAddress)
      .createMarketplaceSale(nftContractAddress, 1, { value: auctionPrice });

    // query for and return the unsold items
    items = await marketplace.fetchMarketplaceItems();

    // prepare items to show
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
  });
});
