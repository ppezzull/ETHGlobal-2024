// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CertificationNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct CertificationData {
        string brand; // Brand of the device
        string model; // Model of the device
        string variant; // Variant of the device
        string serialNumberHash; // Hash of the serial number
        string condition; // Condition of the device
        string picture; // IPFS hash of the picture
        address issuer; // Address of the certification issuer
        uint256 issueDate; // Timestamp of when the certification was issued
    }

    mapping(uint256 => CertificationData) public certifications; // Token ID to certification data

    constructor() ERC721("DeviceCertification", "DCERT") {}

    function mintCertification(
        address to,
        string memory brand,
        string memory model,
        string memory variant,
        string memory serialNumberHash,
        string memory condition,
        string memory picture
    ) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _mint(to, tokenId);
        certifications[tokenId] = CertificationData({
            brand: brand,
            model: model,
            variant: variant,
            serialNumberHash: serialNumberHash,
            condition: condition,
            picture: picture,
            issuer: msg.sender,
            issueDate: block.timestamp
        });
        _tokenIdCounter.increment();
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        CertificationData memory certData = certifications[tokenId];
        string memory json = string(abi.encodePacked(
            '{"name": "', certData.brand, ' ', certData.model, '",',
            '"description": "Certification for ', certData.brand, ' ', certData.model, '",',
            '"attributes": [',
            '{"trait_type": "Brand", "value": "', certData.brand, '"},',
            '{"trait_type": "Model", "value": "', certData.model, '"},',
            '{"trait_type": "Variant", "value": "', certData.variant, '"},',
            '{"trait_type": "Serial Number Hash", "value": "', certData.serialNumberHash, '"},',
            '{"trait_type": "Condition", "value": "', certData.condition, '"},',
            '{"trait_type": "Picture", "value": "', certData.picture, '"}',
            ']}'
        ));
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }
}