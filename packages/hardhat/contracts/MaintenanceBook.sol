// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MaintainedItem {
    struct MaintenanceHistory {
        uint256 timestamp;
        address maintainerAddress;
        string comment;
        uint256 nextServiceDate;
    }

    struct Certification {
        string name;
        string issuer;
        uint256 issueDate;
        address receiver;
        string description;
        string category; // e.g., "cars", "e-cars", "phones"
    }

    string public itemName;
    string public location;
    
    MaintenanceHistory[] public maintenanceHistories;
    Certification[] public certifications;

    mapping(address => bool) public owners; // Multi-owner mapping
    address[] public ownerList; // List of owners

    modifier onlyOwners() {
        require(owners[msg.sender], "Only an owner can perform this action.");
        _;
    }

    constructor(string memory _itemName, string memory _location, address[] memory _initialOwners) {
        itemName = _itemName;
        location = _location;
        
        for (uint256 i = 0; i < _initialOwners.length; i++) {
            owners[_initialOwners[i]] = true;
            ownerList.push(_initialOwners[i]);
        }
    }

    // Function to add maintenance history
    function addMaintenanceHistory(
        address _maintainerAddress,
        string memory _comment,
        uint256 _nextServiceDate
    ) public onlyOwners {
        maintenanceHistories.push(MaintenanceHistory({
            timestamp: block.timestamp,
            maintainerAddress: _maintainerAddress,
            comment: _comment,
            nextServiceDate: _nextServiceDate
        }));
    }

    // Function to add certification
    function addCertification(
        string memory _name,
        string memory _issuer,
        uint256 _issueDate,
        address _receiver,
        string memory _description,
        string memory _category
    ) public onlyOwners {
        certifications.push(Certification({
            name: _name,
            issuer: _issuer,
            issueDate: _issueDate,
            receiver: _receiver,
            description: _description,
            category: _category
        }));
    }

    // Function to get maintenance history count
    function getMaintenanceHistoryCount() public view returns (uint256) {
        return maintenanceHistories.length;
    }

    // Function to get certification count
    function getCertificationCount() public view returns (uint256) {
        return certifications.length;
    }

    // Function to get all owners
    function getOwners() public view returns (address[] memory) {
        return ownerList;
    }
}

contract MaintenanceBook {
    MaintainedItem[] public maintainedItems;

    // Function to create a new MaintainedItem
    function createMaintainedItem(string memory _itemName, string memory _location, address[] memory _initialOwners) public {
        MaintainedItem newItem = new MaintainedItem(_itemName, _location, _initialOwners);
        maintainedItems.push(newItem);
    }

    // Function to get the count of maintained items
    function getMaintainedItemCount() public view returns (uint256) {
        return maintainedItems.length;
    }

    // Function to get a maintained item by index
    function getMaintainedItem(uint256 index) public view returns (address) {
        require(index < maintainedItems.length, "Index out of bounds");
        return address(maintainedItems[index]);
    }

    // Function to get all items owned by a specific address
    function getItemsOwnedBy(address owner) public view returns (address[] memory) {
        address[] memory ownedItems = new address[](maintainedItems.length);
        uint256 count = 0;

        for (uint256 i = 0; i < maintainedItems.length; i++) {
            if (maintainedItems[i].owners(owner)) {
                ownedItems[count] = address(maintainedItems[i]);
                count++;
            }
        }

        // Resize the array to the actual count of owned items
        address[] memory result = new address[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = ownedItems[j];
        }

        return result;
    }
}
