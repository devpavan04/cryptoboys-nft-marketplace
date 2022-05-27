// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    event Mint(uint256 tokenId);

    constructor(address marketplaceAddress) ERC721("Huflit Token", "HUFT") {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        emit Mint(newItemId);
        return newItemId;
    }

    // giveResaleApproval to a marketplace contract
    function giveResaleApproval(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You must own this NFT in order to resell it" );
        setApprovalForAll(contractAddress, true);
    }
}
