// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VerifyMyDevice is ReentrancyGuard {
	using Counters for Counters.Counter;

	// Structs
	struct Seller {
		string location;
		string name;
		bool isRegistered;
	}

	struct Product {
		string deviceType; // "laptop" or "phone"
		uint256 price;
		address tokenAddress;
		address sellerAddress;
	}

	struct PurchasedCertificate {
		address seller;
		address buyer;
		uint256 productId;
		string deviceBrand;
		string deviceVariant;
		string deviceModel;
		bytes32 serialNumberHash;
		string verifiedBrand;
		string verifiedModel;
		string verifiedVariant;
		string condition;
		string remarks;
		bool isCompleted;
		bool isRefunded;
	}

	// State variables
	Counters.Counter private _productIds;
	Counters.Counter private _certificateIds;

	mapping(address => Seller) public sellers;
	mapping(uint256 => Product) public products;
	mapping(uint256 => PurchasedCertificate) public certificates;
	mapping(address => uint256[]) public sellerProducts;
	mapping(address => uint256[]) public buyerCertificates;

	Product[] public allProducts;

	// Events
	event SellerAccountCreated(
		address indexed seller,
		string name,
		string location
	);
	event SellerAccountUpdated(
		address indexed seller,
		string name,
		string location
	);
	event ProductCreated(
		uint256 indexed productId,
		address indexed seller,
		string deviceType,
		uint256 price
	);
	event CertificatePurchased(
		uint256 indexed certificateId,
		address indexed buyer,
		address indexed seller,
		uint256 productId
	);
	event CertificationCompleted(
		uint256 indexed certificateId,
		address indexed seller
	);
	event CertificateRefunded(
		uint256 indexed certificateId,
		address indexed buyer
	);

	// Modifiers
	modifier onlySeller() {
		require(sellers[msg.sender].isRegistered, "Not a registered seller");
		_;
	}

	modifier certificateExists(uint256 _certificateId) {
		require(
			_certificateId > 0 && _certificateId <= _certificateIds.current(),
			"Certificate does not exist"
		);
		_;
	}

	// Functions
	function createSellerAccount(
		string memory _location,
		string memory _name
	) external {
		require(!sellers[msg.sender].isRegistered, "Seller already registered");
		sellers[msg.sender] = Seller(_location, _name, true);
		emit SellerAccountCreated(msg.sender, _name, _location);
	}

	function updateSellerAccount(
		string memory _location,
		string memory _name
	) external onlySeller {
		require(bytes(_location).length > 0, "Location cannot be empty");
		require(bytes(_name).length > 0, "Name cannot be empty");

		Seller storage seller = sellers[msg.sender];
		seller.location = _location;
		seller.name = _name;

		emit SellerAccountUpdated(msg.sender, _name, _location);
	}


	function getSellerDetailsByOfferId(uint256 _offerId) external view returns (string memory, string memory) {
    require(_offerId > 0 && _offerId <= allProducts.length, "Invalid offer ID");
    
    Product memory product = allProducts[_offerId - 1];
    Seller memory seller = sellers[product.sellerAddress];
    
    return (seller.name, seller.location);
	}
	
	function createProduct(
		string memory _type,
		uint256 _price,
		address _tokenAddress
	) external onlySeller {
		require(bytes(_type).length > 0, "Device type cannot be empty");
		require(_price > 0, "Price must be greater than zero");
		require(_tokenAddress != address(0), "Invalid token address");

		_productIds.increment();
		uint256 newProductId = _productIds.current();

		Product memory newProduct = Product(
			_type,
			_price,
			_tokenAddress,
			msg.sender
		);
		products[newProductId] = newProduct;
		allProducts.push(newProduct);
		sellerProducts[msg.sender].push(newProductId);

		emit ProductCreated(newProductId, msg.sender, _type, _price);
	}

	function getAllProducts() external view returns (Product[] memory) {
		return allProducts;
	}

	function purchaseProduct(
		uint256 _productId,
		string memory _deviceBrand,
		string memory _deviceVariant,
		string memory _deviceModel,
		bytes32 _serialNumberHash
	) external nonReentrant {
		require(
			_productId > 0 && _productId <= _productIds.current(),
			"Invalid product ID"
		);
		Product memory product = products[_productId];
		require(product.sellerAddress != address(0), "Product does not exist");

		_certificateIds.increment();
		uint256 newCertificateId = _certificateIds.current();

		PurchasedCertificate memory newCertificate = PurchasedCertificate(
			product.sellerAddress,
			msg.sender,
			_productId,
			_deviceBrand,
			_deviceVariant,
			_deviceModel,
			_serialNumberHash,
			"",
			"",
			"",
			"",
			"",
			false,
			false
		);

		certificates[newCertificateId] = newCertificate;
		buyerCertificates[msg.sender].push(newCertificateId);

		_transferTokens(
			msg.sender,
			product.sellerAddress,
			product.tokenAddress,
			product.price
		);

		emit CertificatePurchased(
			newCertificateId,
			msg.sender,
			product.sellerAddress,
			_productId
		);
	}

	function getAllPurchasedCertificatesBySeller(
		address _seller
	) external view returns (uint256[] memory) {
		uint256 count = 0;
		for (uint256 i = 1; i <= _certificateIds.current(); i++) {
			if (certificates[i].seller == _seller) {
				count++;
			}
		}

		uint256[] memory sellerCertificates = new uint256[](count);
		uint256 index = 0;
		for (uint256 i = 1; i <= _certificateIds.current(); i++) {
			if (certificates[i].seller == _seller) {
				sellerCertificates[index] = i;
				index++;
			}
		}

		return sellerCertificates;
	}

	function completeCertification(
		uint256 _certificateId,
		string memory _verifiedBrand,
		string memory _verifiedModel,
		string memory _verifiedVariant,
		string memory _condition,
		string memory _remarks
	) external onlySeller certificateExists(_certificateId) {
		PurchasedCertificate storage certificate = certificates[_certificateId];
		require(
			certificate.seller == msg.sender,
			"Not the seller of this certificate"
		);
		require(!certificate.isCompleted, "Certificate already completed");

		certificate.verifiedBrand = _verifiedBrand;
		certificate.verifiedModel = _verifiedModel;
		certificate.verifiedVariant = _verifiedVariant;
		certificate.condition = _condition;
		certificate.remarks = _remarks;
		certificate.isCompleted = true;

		emit CertificationCompleted(_certificateId, msg.sender);
	}

	function getAllCertificatesByBuyer(
		address _buyer
	) external view returns (uint256[] memory) {
		return buyerCertificates[_buyer];
	}

	function getCertificateDetails(
		uint256 _certificateId
	)
		external
		view
		certificateExists(_certificateId)
		returns (PurchasedCertificate memory)
	{
		return certificates[_certificateId];
	}

	function refundCertificate(
		uint256 _certificateId
	) external onlySeller certificateExists(_certificateId) {
		PurchasedCertificate storage certificate = certificates[_certificateId];
		require(
			certificate.seller == msg.sender,
			"Not the seller of this certificate"
		);
		require(
			!certificate.isCompleted,
			"Cannot refund completed certificate"
		);
		require(!certificate.isRefunded, "Certificate already refunded");

		certificate.isRefunded = true;
		Product memory product = products[certificate.productId];

		_transferTokens(
			address(product.sellerAddress),
			certificate.buyer,
			product.tokenAddress,
			product.price
		);

		emit CertificateRefunded(_certificateId, msg.sender);
	}

	// Helper functions
	function _transferTokens(
		address _from,
		address _to,
		address _tokenAddress,
		uint256 _amount
	) internal {
		IERC20 token = IERC20(_tokenAddress);
		require(
			token.transferFrom(_from, _to, _amount),
			"Token transfer failed"
		);
	}
}
