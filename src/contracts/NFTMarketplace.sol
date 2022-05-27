// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// contract NFTMarketplace is ERC721URIStorage {
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;
//     Counters.Counter private _itemsSold;
//     string public collectionName;
//     string public collectionNameSymbol;

//     uint256 listingPrice = 0.025 ether;
//     address payable owner;

//     mapping(uint256 => MarketItem) private idToMarketItem;

//     struct MarketItem {
//       uint256 tokenId;
//       address payable seller;
//       address payable owner;
//       uint256 price;
//       bool sold;
//     }

//     event MarketItemCreated (
//       uint256 indexed tokenId,
//       address seller,
//       address owner,
//       uint256 price,
//       bool sold
//     );

//     constructor() ERC721("HUFLIT Tokens", "HUFT") {
//       owner = payable(msg.sender);
//       collectionName = name();
//       collectionNameSymbol = symbol();
//     }

//     /* Updates the listing price of the contract */
//     function updateListingPrice(uint _listingPrice) public payable {
//       require(owner == msg.sender, "Only marketplace owner can update listing price.");
//       listingPrice = _listingPrice;
//     }

//     /* Returns the listing price of the contract */
//     function getListingPrice() public view returns (uint256) {
//       return listingPrice;
//     }

//     /* Mints a token and lists it in the marketplace */
//     function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
//       _tokenIds.increment();
//       uint256 newTokenId = _tokenIds.current();

//       _mint(msg.sender, newTokenId);
//       _setTokenURI(newTokenId, tokenURI);
//       createMarketItem(newTokenId, price);
//       return newTokenId;
//     }

//     function createMarketItem(
//       uint256 tokenId,
//       uint256 price
//     ) private {
//       require(price > 0, "Price must be at least 1 wei");
//       require(msg.value == listingPrice, "Price must be equal to listing price");

//       idToMarketItem[tokenId] =  MarketItem(
//         tokenId,
//         payable(msg.sender),
//         payable(address(this)),
//         price,
//         false
//       );

//       _transfer(msg.sender, address(this), tokenId);
//       emit MarketItemCreated(
//         tokenId,
//         msg.sender,
//         address(this),
//         price,
//         false
//       );
//     }

//     /* allows someone to resell a token they have purchased */
//     function resellToken(uint256 tokenId, uint256 price) public payable {
//       require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
//       require(msg.value == listingPrice, "Price must be equal to listing price");
//       idToMarketItem[tokenId].sold = false;
//       idToMarketItem[tokenId].price = price;
//       idToMarketItem[tokenId].seller = payable(msg.sender);
//       idToMarketItem[tokenId].owner = payable(address(this));
//       _itemsSold.decrement();

//       _transfer(msg.sender, address(this), tokenId);
//     }

//     /* Creates the sale of a marketplace item */
//     /* Transfers ownership of the item, as well as funds between parties */
//     function createMarketSale(
//       uint256 tokenId
//       ) public payable {
//       uint price = idToMarketItem[tokenId].price;
//       address seller = idToMarketItem[tokenId].seller;
//       require(msg.value == price, "Please submit the asking price in order to complete the purchase");
//       idToMarketItem[tokenId].owner = payable(msg.sender);
//       idToMarketItem[tokenId].sold = true;
//       idToMarketItem[tokenId].seller = payable(address(0));
//       _itemsSold.increment();
//       _transfer(address(this), msg.sender, tokenId);
//       payable(owner).transfer(listingPrice);
//       payable(seller).transfer(msg.value);
//     }

//     /* Returns all unsold market items */
//     function fetchMarketItems() public view returns (MarketItem[] memory) {
//       uint itemCount = _tokenIds.current();
//       uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
//       uint currentIndex = 0;

//       MarketItem[] memory items = new MarketItem[](unsoldItemCount);
//       for (uint i = 0; i < itemCount; i++) {
//         if (idToMarketItem[i + 1].owner == address(this)) {
//           uint currentId = i + 1;
//           MarketItem storage currentItem = idToMarketItem[currentId];
//           items[currentIndex] = currentItem;
//           currentIndex += 1;
//         }
//       }
//       return items;
//     }

//     /* Returns only items that a user has purchased */
//     function fetchMyNFTs() public view returns (MarketItem[] memory) {
//       uint totalItemCount = _tokenIds.current();
//       uint itemCount = 0;
//       uint currentIndex = 0;

//       for (uint i = 0; i < totalItemCount; i++) {
//         if (idToMarketItem[i + 1].owner == msg.sender) {
//           itemCount += 1;
//         }
//       }

//       MarketItem[] memory items = new MarketItem[](itemCount);
//       for (uint i = 0; i < totalItemCount; i++) {
//         if (idToMarketItem[i + 1].owner == msg.sender) {
//           uint currentId = i + 1;
//           MarketItem storage currentItem = idToMarketItem[currentId];
//           items[currentIndex] = currentItem;
//           currentIndex += 1;
//         }
//       }
//       return items;
//     }

//     /* Returns only items a user has listed */
//     function fetchItemsListed() public view returns (MarketItem[] memory) {
//       uint totalItemCount = _tokenIds.current();
//       uint itemCount = 0;
//       uint currentIndex = 0;

//       for (uint i = 0; i < totalItemCount; i++) {
//         if (idToMarketItem[i + 1].seller == msg.sender) {
//           itemCount += 1;
//         }
//       }

//       MarketItem[] memory items = new MarketItem[](itemCount);
//       for (uint i = 0; i < totalItemCount; i++) {
//         if (idToMarketItem[i + 1].seller == msg.sender) {
//           uint currentId = i + 1;
//           MarketItem storage currentItem = idToMarketItem[currentId];
//           items[currentIndex] = currentItem;
//           currentIndex += 1;
//         }
//       }
//       return items;
//     }
// }

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _items;
  Counters.Counter private _soldItems;

  address payable owner;

  uint256 listingPrice = 0.025 ether; // minimum price, change for what you want

  // interface to marketplace item
  struct MarketplaceItem {
      uint256 itemId;
      address nftContract;
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
  }

  mapping(uint256 => MarketplaceItem) private idToMarketplaceItem;

  // declare a event for when a item is created on marketplace
  event MarketplaceItemCreated(
      uint256 indexed itemId,
      address indexed nftContract,
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
  );

  constructor() {
      owner = payable(msg.sender);
  }

  // returns the listing price of the contract
  function getListingPrice() public view returns (uint256) {
      return listingPrice;
  }

  // places an item for sale on the marketplace
  function createMarketplaceItem(
      address nftContract,
      uint256 tokenId,
      uint256 price
  ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei");
      require(
          msg.value == listingPrice,
          "Price must be equal to listing price"
      );

      _items.increment();
      uint256 itemId = _items.current();

      idToMarketplaceItem[itemId] = MarketplaceItem(
          itemId,
          nftContract,
          tokenId,
          payable(msg.sender),
          payable(address(0)),
          price,
          false
      );

      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

      emit MarketplaceItemCreated(
          itemId,
          nftContract,
          tokenId,
          msg.sender,
          address(0),
          price,
          false
      );
  }

  // creates the sale of a marketplace item
  // transfers ownership of the item, as well as funds between parties
  function createMarketplaceSale(address nftContract, uint256 itemId)
      public
      payable
      nonReentrant
  {
      uint256 price = idToMarketplaceItem[itemId].price;
      uint256 tokenId = idToMarketplaceItem[itemId].tokenId;

      require(
          msg.value == price,
          "Please submit the asking price in order to complete the purchase"
      );

      idToMarketplaceItem[itemId].seller.transfer(msg.value);
      IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
      idToMarketplaceItem[itemId].owner = payable(msg.sender);
      idToMarketplaceItem[itemId].sold = true;

      _soldItems.increment();

      payable(owner).transfer(listingPrice);
  }

  // returns all unsold marketplace items
  function fetchMarketplaceItems()
      public
      view
      returns (MarketplaceItem[] memory)
  {
      uint256 itemCount = _items.current();
      uint256 unsoldItemCount = _items.current() - _soldItems.current();
      uint256 currentIndex = 0;

      MarketplaceItem[] memory items = new MarketplaceItem[](unsoldItemCount);
      for (uint256 i = 0; i < itemCount; i++) {
          if (idToMarketplaceItem[i + 1].owner == address(0)) {
              uint256 currentId = i + 1;
              MarketplaceItem storage currentItem = idToMarketplaceItem[
                  currentId
              ];
              items[currentIndex] = currentItem;
              currentIndex += 1;
          }
      }
      return items;
  }

  // returns only items that a user has purchased
  function fetchMyNFTs() public view returns (MarketplaceItem[] memory) {
      uint256 totalItemCount = _items.current();
      uint256 itemCount = 0;
      uint256 currentIndex = 0;

      for (uint256 i = 0; i < totalItemCount; i++) {
          if (idToMarketplaceItem[i + 1].owner == msg.sender) {
              itemCount += 1;
          }
      }

      MarketplaceItem[] memory items = new MarketplaceItem[](itemCount);
      for (uint256 i = 0; i < totalItemCount; i++) {
          if (idToMarketplaceItem[i + 1].owner == msg.sender) {
              uint256 currentId = i + 1;
              MarketplaceItem storage currentItem = idToMarketplaceItem[
                  currentId
              ];
              items[currentIndex] = currentItem;
              currentIndex += 1;
          }
      }
      return items;
  }

  // returns only items a user has created
  function fetchItemsCreated()
      public
      view
      returns (MarketplaceItem[] memory)
  {
      uint256 totalItemCount = _items.current();
      uint256 itemCount = 0;
      uint256 currentIndex = 0;

      for (uint256 i = 0; i < totalItemCount; i++) {
          if (idToMarketplaceItem[i + 1].seller == msg.sender) {
              itemCount += 1;
          }
      }

      MarketplaceItem[] memory items = new MarketplaceItem[](itemCount);

      for (uint256 i = 0; i < totalItemCount; i++) {
          if (idToMarketplaceItem[i + 1].seller == msg.sender) {
              uint256 currentId = i + 1;
              MarketplaceItem storage currentItem = idToMarketplaceItem[
                  currentId
              ];
              items[currentIndex] = currentItem;
              currentIndex += 1;
          }
      }

      return items;
  }

    //update the price of a marketplace item
    function updateMarketplaceItemPrice(uint256 itemId, uint256 price)
        public
        payable
        nonReentrant
    {
        require(
            idToMarketplaceItem[itemId].owner == msg.sender,
            "You must be the owner of the item to update the price"
        );
        require(
            price > 0,
            "Price must be at least 1 wei"
        );
        idToMarketplaceItem[itemId].price = price;
    }

    function resellToken(address nftContract, uint256 tokenId, uint256 price) public payable {
      require(idToMarketplaceItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketplaceItem[tokenId].sold = false;
      idToMarketplaceItem[tokenId].price = price;
      idToMarketplaceItem[tokenId].seller = payable(msg.sender);
      idToMarketplaceItem[tokenId].owner = payable(address(this));
      _soldItems.decrement();

      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    }

    
}