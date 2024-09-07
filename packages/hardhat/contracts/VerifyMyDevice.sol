// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CertificationNFT.sol"; // Import the CertificationNFT contract

contract VerifyMyDevice {
    IERC20 public usdtToken; // Interface for the USDT token contract
    CertificationNFT public certificationNFT; // Reference to the CertificationNFT contract

    struct Product {
        uint256 certificationId; // ID of the associated certification NFT
        address owner; // Current owner of the product
        string brand; // Brand of the product
        string model; // Model of the product
        string variant; // Variant of the product
        string serialNumberHash; // Hash of the serial number
        uint256 price; // Price in USDT
        bool sold; // New boolean feature to indicate if the product has been sold
    }

    struct Seller {
        address sellerAddress; // Seller's address
        string name; // Seller's name
        string location; // Seller's location
        uint256[] devices; // Array of product IDs
    }

    mapping(uint256 => Product) public products; // Product ID to Product
    mapping(address => Seller) public sellers; // Address to Seller

    event ProductRegistered(uint256 indexed productId, address indexed owner, string brand, string model);
    event CertificationAssigned(address indexed owner, uint256 indexed tokenId);
    event ProductSold(uint256 indexed productId, address indexed prevOwner, address indexed newOwner);

    constructor(address _usdtAddress, address _certificationNFTAddress) {
        usdtToken = IERC20(_usdtAddress); // Set the USDT token contract address
        certificationNFT = CertificationNFT(_certificationNFTAddress); // Set the CertificationNFT contract address
    }

    // Function to set up a product
    function setupProduct(
        string memory brand,
        string memory model,
        string memory variant,
        string memory serialNumberHash,
        uint256 price
    ) external returns (uint256) {
        uint256 productId = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp))); // Unique product ID
        products[productId] = Product({
            certificationId: 0, // Initially no certification
            owner: msg.sender,
            brand: brand,
            model: model,
            variant: variant,
            serialNumberHash: serialNumberHash,
            price: price,
            sold: false // Initialize sold to false
        });

        sellers[msg.sender].devices.push(productId); // Add product to seller's devices
        emit ProductRegistered(productId, msg.sender, brand, model);
        return productId;
    }

    // Function to assign a certification to a registered product
    function assignCertification(
        uint256 productId,
        string memory condition,
        string memory picture
    ) external {
        Product storage product = products[productId];
        require(product.owner == msg.sender, "Only the owner can assign a certification");

        // Transfer USDT from the caller to pay for the certification
        usdtToken.transferFrom(msg.sender, address(this), product.price);

        // Mint the certification NFT
        uint256 tokenId = certificationNFT.mintCertification(
            msg.sender,
            product.brand,
            product.model,
            product.variant,
            product.serialNumberHash,
            condition,
            picture
        );

        product.certificationId = tokenId; // Assign the certification ID to the product
        emit CertificationAssigned(msg.sender, tokenId);
    }

    // Function to sell a certified product
    function sellCertification(uint256 productId, address newOwner, uint256 price) external {
        Product storage product = products[productId];
        require(product.owner == msg.sender, "Only the owner can sell the certification");
        require(newOwner != address(0), "Invalid new owner address");
        require(!product.sold, "Product has already been sold"); // Check if the product is already sold

        // Transfer the certification NFT to the new owner
        certificationNFT.safeTransferFrom(msg.sender, newOwner, product.certificationId);

        // Update the product owner and mark it as sold
        product.owner = newOwner;
        product.sold = true; // Mark the product as sold

        // Transfer USDT from the new owner to the seller
        usdtToken.transferFrom(newOwner, msg.sender, price);

        emit ProductSold(productId, msg.sender, newOwner);
    }
}