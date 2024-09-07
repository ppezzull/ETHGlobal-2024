// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerifyMyDevice {
    struct Certification {
        string deviceType; // "phone" or "laptop"
        string deviceId; // Unique identifier for the device
        address issuer; // Address of the certification issuer
        string details; // Certification details
        uint256 issueDate; // Timestamp of when the certification was issued
        uint256 expiryDate; // Timestamp of when the certification expires
        uint256 price; // Price of the certification
    }

    struct Booking {
        address deviceOwner;
        string deviceId;
        address issuer;
        uint256 bookingDate;
        uint256 price; // Total price including interest
        bool isConfirmed;
        Certification certification; // Reference to associated certification
    }

    struct Account {
        address accountAddress; // Address of the account
        bool isOwner; // Indicates if the account is an owner
        string[] availableDevices; // Devices the account can certify
        uint256[] prices; // Prices for certifications
        uint256[] availability; // Availability slots
    }

    mapping(address => Certification[]) public certifications; // Device owner to certifications
    mapping(address => Booking[]) public bookings; // Device owner to bookings
    mapping(address => mapping(address => Booking[])) public userBookings; // User to all their bookings (both buying and selling)
    mapping(address => Account) public accounts; // Accounts

    uint256 public totalInterest; // Total interest collected

    event CertificationIssued(address indexed owner, string deviceId, address indexed issuer);
    event BookingCreated(address indexed owner, string deviceId, address indexed issuer, uint256 price);
    event AccountCreated(address indexed accountAddress, bool isOwner);
    event InterestWithdrawn(address indexed owner, uint256 amount);

    // Function for creating an account
    function createAccount(bool isOwner) external {
        require(accounts[msg.sender].accountAddress == address(0), "Account already exists");
        
        accounts[msg.sender] = Account({
            accountAddress: msg.sender,
            isOwner: isOwner,
            availableDevices: new string[](0),
            prices: new uint256[](0),
            availability: new uint256[](0)
        });

        emit AccountCreated(msg.sender, isOwner);
    }

    // Function for device owners to book a certification slot
    function bookCertification(string memory deviceId, address issuer, Certification memory certification) external {
        require(accounts[issuer].accountAddress != address(0), "Issuer not available");
        require(accounts[msg.sender].accountAddress != address(0), "Account does not exist");
        
        // Get the price of the certification
        uint256 price = accounts[issuer].prices[0]; // Assuming the first price is used for simplicity
        uint256 interest = (price * 3) / 100; // Calculate 3% interest
        uint256 totalPrice = price + interest; // Total price including interest

        Booking memory newBooking = Booking({
            deviceOwner: msg.sender,
            deviceId: deviceId,
            issuer: issuer,
            bookingDate: block.timestamp,
            price: totalPrice,
            isConfirmed: false,
            certification: certification // Associate the relevant certification
        });

        bookings[msg.sender].push(newBooking);
        userBookings[msg.sender][issuer].push(newBooking); // Store in userBookings mapping
        userBookings[issuer][msg.sender].push(newBooking); // Store in userBookings mapping for issuer
        totalInterest += interest; // Add interest to the total interest collected
        emit BookingCreated(msg.sender, deviceId, issuer, totalPrice);
    }

    // Function for accounts to create certification
    function createCertification(string memory deviceType, string memory deviceId, string memory details, uint256 expiryDate, uint256 price) external {
        require(accounts[msg.sender].accountAddress != address(0), "Account does not exist");
        
        Certification memory newCert = Certification({
            deviceType: deviceType,
            deviceId: deviceId,
            issuer: msg.sender, // Use account.accountAddress as the issuer
            details: details,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            price: price
        });

        certifications[msg.sender].push(newCert);
        emit CertificationIssued(msg.sender, deviceId, msg.sender);
    }

    // Function for device owners to view their certifications
    function viewCertifications() external view returns (Certification[] memory) {
        require(accounts[msg.sender].accountAddress != address(0), "Account does not exist");
        return certifications[msg.sender];
    }

    // Function for accounts to set their availability and prices
    function setAccountDetails(string[] memory devices, uint256[] memory prices, uint256[] memory availability) external {
        require(accounts[msg.sender].accountAddress != address(0), "Account does not exist");
        
        accounts[msg.sender].availableDevices = devices;
        accounts[msg.sender].prices = prices;
        accounts[msg.sender].availability = availability;
    }

    // Function to view all bookings for a user (both selling and buying)
    function viewAllBookings() external view returns (Booking[] memory) {
        require(accounts[msg.sender].accountAddress != address(0), "Account does not exist");
        
        // Concatenate all bookings for the user
        Booking[] memory allBookings = new Booking[](userBookings[msg.sender][msg.sender].length + userBookings[msg.sender][address(0)].length);
        uint256 index = 0;
        
        // Add user's selling bookings
        for (uint256 i = 0; i < userBookings[msg.sender][msg.sender].length; i++) {
            allBookings[index++] = userBookings[msg.sender][msg.sender][i];
        }
        
        // Add user's buying bookings
        for (uint256 i = 0; i < userBookings[msg.sender][address(0)].length; i++) {
            allBookings[index++] = userBookings[msg.sender][address(0)][i];
        }
        
        return allBookings;
    }

    // Function for owners to withdraw interest
    function withdrawInterest() external {
        require(accounts[msg.sender].isOwner, "Only owners can withdraw interest");
        uint256 amount = totalInterest;
        totalInterest = 0;
        payable(msg.sender).transfer(amount);
        emit InterestWithdrawn(msg.sender, amount);
    }
}