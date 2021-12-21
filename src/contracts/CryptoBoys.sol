// SPDX-License-Identifier: MIT
pragma solidity <0.8.0;
pragma abicoder v2;

// import ERC721 iterface
import "./ERC721.sol";

// CryptoBoys smart contract inherits ERC721 interface
contract CryptoBoys is ERC721 {
  string public collectionName;
  string public collectionNameSymbol;
  uint256 public cryptoBoyCounter;
  string public baseExtension = ".json";
  uint256 public cost = 1 ether;
  uint256 public maxSupply = 6666;
  uint256 public maxMintAmount = 20;
  uint256 public nftPerAddressLimit = 20;
  mapping(uint256 => CryptoBoy) public allCryptoBoys;
  mapping(address => uint256) public addressMintedBalance;
  mapping(string => bool) public tokenURIExists;
  address public owner;
  address payable commissions = payable(0x747A75F7728039E8C8aa96605D81E18CcCEd4056);

  // define crypto boy struct
   struct CryptoBoy {
    uint256 tokenId;
    address payable mintedBy;
    address payable currentOwner;
    address payable previousOwner;
    uint256 price;
    uint256 numberOfTransfers;
    bool forSale;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // initialize contract while deployment with contract's collection name and token
  constructor( ) ERC721("CRSkull", "CRS") {
    owner = msg.sender;
    collectionName = name();
    collectionNameSymbol = symbol();
  }

  function setBaseURI( string memory baseURI ) public onlyOwner {
    _setBaseURI(baseURI);
  }

  //retunr allowed max supply
  function getMaxSupply( ) public view returns(uint256){
    return maxSupply;
  }

  function getCost() public view returns(uint256){
    return cost;
  }

  // mint a new crypto boy
  function mintCryptoBoy(uint256 _mintAmount ) payable external {
    // check if thic fucntion caller is not an zero address account
    require(msg.sender != address(0));
    // increment counter
    // check if a token exists with the above token id => incremented counter

    uint256 supply = totalSupply();
    require(_mintAmount > 0, "need to mint at least 1 NFT");
    require(_mintAmount <= maxMintAmount, "max mint amount per session exceeded");
    require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");
    require(msg.value >= cost * _mintAmount, "insufficient funds");

    for (uint256 i = 1; i <= _mintAmount; i++) {
      cryptoBoyCounter++;
      require(!_exists(cryptoBoyCounter));
      addressMintedBalance[msg.sender]++;
      _mint(msg.sender, cryptoBoyCounter);
      CryptoBoy memory newCryptoBoy = CryptoBoy(
        cryptoBoyCounter,
        msg.sender,
        msg.sender,
        address(0),
        cost,
        0,
      false);
      allCryptoBoys[cryptoBoyCounter] = newCryptoBoy;
    }

    (bool success, ) = payable(commissions).call{value: msg.value * 6 / 100}("");
    
    require(success);
    // add the token id and it's crypto boy to all crypto boys mapping
  }

  function getOwner() public view returns(address) {
    return owner;
  }
  // get owner of the token
  function getTokenOwner(uint256 _tokenId) public view returns(address) {
    address _tokenOwner = ownerOf(_tokenId);
    return _tokenOwner;
  }

  // get metadata of the token
  function getTokenMetaData(uint _tokenId) public view returns(string memory) {
    string memory tokenMetaData = tokenURI(_tokenId);
    return tokenMetaData;
  }

  // get total number of tokens minted so far
  function getNumberOfTokensMinted() public view returns(uint256) {
    uint256 totalNumberOfTokensMinted = totalSupply();
    return totalNumberOfTokensMinted;
  }

  // get total number of tokens owned by an address
  function getTotalNumberOfTokensOwnedByAnAddress(address _owner) public view returns(uint256) {
    uint256 totalNumberOfTokensOwned = balanceOf(_owner);
    return totalNumberOfTokensOwned;
  }

  // check if the token already exists
  function getTokenExists(uint256 _tokenId) public view returns(bool) {
    bool tokenExists = _exists(_tokenId);
    return tokenExists;
  }

  // by a token by passing in the token's id
  function buyToken(uint256 _tokenId) public payable {
    // check if the function caller is not an zero account address
    require(msg.sender != address(0));
    // check if the token id of the token being bought exists or not
    require(_exists(_tokenId));
    // get the token's owner
    address tokenOwner = ownerOf(_tokenId);
    // token's owner should not be an zero address account
    require(tokenOwner != address(0));
    // the one who wants to buy the token should not be the token's owner
    require(tokenOwner != msg.sender);
    // get that token from all crypto boys mapping and create a memory of it defined as (struct => CryptoBoy)
    CryptoBoy memory cryptoboy = allCryptoBoys[_tokenId];
    // price sent in to buy should be equal to or more than the token's price
    require(msg.value >= cryptoboy.price);
    // token should be for sale
    require(cryptoboy.forSale);
    // transfer the token from owner to the caller of the function (buyer)
    _transfer(tokenOwner, msg.sender, _tokenId);
    // get owner of the token
    address payable sendTo = cryptoboy.currentOwner;
    // send token's worth of ethers to the owner
    (bool success, ) = payable(commissions).call{value: msg.value * 6 / 100}("");
    require( success );
    sendTo.transfer(msg.value * 94 / 100);
    // update the token's previous owner
    cryptoboy.previousOwner = cryptoboy.currentOwner;
    // update the token's current owner
    cryptoboy.currentOwner = msg.sender;
    // update the how many times this token was transfered
    cryptoboy.numberOfTransfers += 1;
    // set and update that token in the mapping
    allCryptoBoys[_tokenId] = cryptoboy;
  }

  function changeTokenPrice(uint256 _tokenId, uint256 _newPrice) public {
    // require caller of the function is not an empty address
    require(msg.sender != address(0));
    // require that token should exist
    require(_exists(_tokenId));
    // get the token's owner
    address tokenOwner = ownerOf(_tokenId);
    // check that token's owner should be equal to the caller of the function
    require(tokenOwner == msg.sender);
    // get that token from all crypto boys mapping and create a memory of it defined as (struct => CryptoBoy)
    CryptoBoy memory cryptoboy = allCryptoBoys[_tokenId];
    // update token's price with new price
    cryptoboy.price = _newPrice;
    // set and update that token in the mapping
    allCryptoBoys[_tokenId] = cryptoboy;
  }

  // switch between set for sale and set not for sale
  function toggleForSale(uint256 _tokenId) public {
    // require caller of the function is not an empty address
    require(msg.sender != address(0));
    // require that token should exist
    require(_exists(_tokenId));
    // get the token's owner
    address tokenOwner = ownerOf(_tokenId);
    // check that token's owner should be equal to the caller of the function
    require(tokenOwner == msg.sender);
    // get that token from all crypto boys mapping and create a memory of it defined as (struct => CryptoBoy)
    CryptoBoy memory cryptoboy = allCryptoBoys[_tokenId];
    // if token's forSale is false make it true and vice versa
    if(cryptoboy.forSale) {
      cryptoboy.forSale = false;
    } else {
      cryptoboy.forSale = true;
    }
    // set and update that token in the mapping
    allCryptoBoys[_tokenId] = cryptoboy;
  }

  function setNftPerAddressLimit(uint256 _limit) public onlyOwner {
    nftPerAddressLimit = _limit;
  }
  
  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
    maxMintAmount = _newmaxMintAmount;
  }
  function withdraw() public payable onlyOwner {
    (bool os, ) = payable(owner).call{value: address(this).balance}("");
    require(os);
  }
}