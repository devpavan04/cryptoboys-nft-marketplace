//SPDX-License-Identifier: MIT
pragma solidity  >=0.8.0;
pragma abicoder v2;

import "./ERC721.sol";

contract CryptoPaws is ERC721 {

    // name of paw collection for contract
    string public collectionName;
    // symbol for paw tokens
    string public collectionNameSymbol;
    // total number of paws
    uint256 public pawCounter;

    //set a default price for freshly minted paws
    uint256 public defaultPrice = 20000000 gwei;
    //set a default mint price
    uint256 public mintPrice = 20000000 gwei;

    // define paw struct
    struct CryptoPaw {
        //unique tokenid
        uint256 tokenId;
        //string that specifies unique color combination
        string creationStr;
        //string that holds URI that points to image file on ipfs
        string tokenURI;
        //address of the account that minted the token
        address payable mintedBy;
        //address of current token owner
        address payable currentOwner;
        //set price of token
        uint256 price;
        //tracks number of times token changed ownership
        uint256 timesTransferred;
        bool forSale;
    }

    // map tokenId to a Paw
    mapping(uint256 => CryptoPaw) public allPaws;
    // check if a selector number already exists
    mapping(string => bool) public creationStrs;
    // check if a URI exists
    mapping(string => bool) public tokenURIExists;

    // constructor that creates the ERC721
    constructor() ERC721("Original CryptoPaws Collection","PAW") {
        collectionName = name();
        collectionNameSymbol = symbol();
    }

    // minting function for new PAW
    function mintPaw(string memory _creationStr, string memory _tokenURI) external payable{
        //make sure address exists and isnt a 0 address
        require(msg.sender != address(0), "Non-zero addresses only");
        //make sure the mint price is paid
        require(msg.value >= mintPrice, "You must pay the actual mint price");
        //increment the collection counter
        pawCounter++;
        //pawCounter is the tokenid in this case
        require(!_exists(pawCounter), "collection counter not found");
        //checks that color combo does not already exist
        require(!creationStrs[_creationStr], "this paw print already exists");
        //checks that uri is new
        require(!tokenURIExists[_tokenURI], "the URI already exists");

        //mint time baby
        _mint(msg.sender, pawCounter);
        //set the URI for the token
        _setTokenURI(pawCounter, _tokenURI);
        
        //add URI to URI list
        tokenURIExists[_tokenURI] = true;
        
        
        CryptoPaw memory newCryptoPaw = CryptoPaw(
            pawCounter,
            _creationStr,
            _tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            defaultPrice,
            0,
            false);

            allPaws[pawCounter] = newCryptoPaw;
    }

    //get the owner of a token
    function getTokenOwner(uint256 _tokenId) public view returns(address) {
        address tokenOwner = ownerOf(_tokenId);
        return tokenOwner;
    }

    //get token image
    function getTokenImg(uint256 _tokenId) public view returns(string memory) {
        string memory tokenImg = tokenURI(_tokenId);
        return tokenImg;
    }

    //get total number of tokens
    function getTotalNumberMinted() public view returns(uint256) {
        uint256 totalNumberOfTokensMinted = totalSupply();
        return totalNumberOfTokensMinted;
    }

    //get number of tokens owned by an address
    function getTotalNumberOwnedByAddress(address _owner) public view returns(uint256) {
        uint totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }

    //check if token exists
    function getTokenExists(uint256 _tokenId) public view returns(bool) {
        bool tokenExists = _exists(_tokenId);
        return tokenExists;
    }

    function buyToken(uint256 _tokenId) public payable {
        //check for nonzero account
        require(msg.sender != address(0), "non-zero addresses only");
        // check if tokenId exists
        require(_exists(_tokenId), "this paw does not exist");

        //get token owner's address
        address payable tokenOwner = payable(ownerOf(_tokenId));

        //check if token owner is nonzero
        require(tokenOwner != address(0), "non-zero addresses only");
        //check that buyer is not token owner
        require(tokenOwner != msg.sender, "you can't buy your own token");


        //verify price sent is equal to or more than asking price
        require(msg.value >= allPaws[_tokenId].price, "please send the correct amount of eth");
        //verify paw is for sale
        require(allPaws[_tokenId].forSale, "this paw is not for sale");

        //transfer token ownership
        _transfer(tokenOwner, msg.sender, _tokenId);

        //send previous owner the payment
        tokenOwner.transfer(msg.value);

        //set new owner
        allPaws[_tokenId].currentOwner = payable(msg.sender);
        //increase transfer counter
        allPaws[_tokenId].timesTransferred++;
    }

    function changeTokenPrice(uint256 _tokenId, uint256 _newPrice) public {
        //require caller is not zero address
        require(msg.sender != address(0), "non-zero addresses only");
        //require token exists
        require(_exists(_tokenId), "token does not exist");
        
        //get token owner
        address tokenOwner = ownerOf(_tokenId);
        //check sender is owner
        require(tokenOwner == msg.sender, "you cannot edit a token that is not yours");

        //update price
        allPaws[_tokenId].price = _newPrice;
    }

    function toggleForSale(uint256 _tokenId) public {
        //address 0 safeguard
        require(msg.sender != address(0), "non-zero addresses only");
        //require token exists
        require(_exists(_tokenId), "token does not exist");

        //get token owner
        address tokenOwner = ownerOf(_tokenId);
        //check that owner is sender
        require(tokenOwner == msg.sender, "you cannot edit a token that is not yours");
        
        //toggle the sale state
        if(allPaws[_tokenId].forSale) {
            allPaws[_tokenId].forSale = false;
        } else {
            allPaws[_tokenId].forSale = true;
        }
    }
}