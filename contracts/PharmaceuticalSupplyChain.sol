// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract PharmaceuticalSupplyChain {
    // Define roles using an enum
    enum Role {
        Admin,
        Supplier,
        LogisticEmployee,
        Auditor
    }

    struct User {
        address userAddress;
        Role role;
    }

    struct Product {
        uint256 id;
        string name;
        string manufacturer;
        uint256 quantity;
        address currentOwner;
    }

    struct Shipment {
        uint256 transferId;
        uint256 productId;
        address origin;
        address destination;
        uint256 dateOfDeparture;
        uint256 expectedArrivalDate;
        string status;
        bool delivered;
    }

    address public owner;
    uint256 public productCount;
    uint256 public shipmentCount;
    mapping(address => User) public users;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Shipment) public shipments;

    event UserAdded(address indexed userAddress, Role role);
    event ProductAdded(
        uint256 indexed productId,
        string name,
        string manufacturer,
        uint256 quantity
    );
    event ShipmentCreated(
        uint256 indexed transferId,
        uint256 indexed productId,
        address origin,
        address destination
    );
    event ShipmentStatusUpdated(uint256 indexed transferId, string status);
    event ShipmentDelivered(uint256 indexed transferId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin, "Not an admin");
        _;
    }

    modifier onlySupplier() {
        require(users[msg.sender].role == Role.Supplier, "Not a supplier");
        _;
    }

    modifier onlyLogisticEmployee() {
        require(
            users[msg.sender].role == Role.LogisticEmployee,
            "Not a logistic employee"
        );
        _;
    }

    modifier onlyAuditor() {
        require(users[msg.sender].role == Role.Auditor, "Not an auditor");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Assign the deployer the Admin role
        users[owner] = User(owner, Role.Admin);
        emit UserAdded(owner, Role.Admin);
    }

    function addUser(address _userAddress, Role _role) external onlyAdmin {
        users[_userAddress] = User(_userAddress, _role);
        emit UserAdded(_userAddress, _role);
    }

    function addProduct(
        string calldata _name,
        string calldata _manufacturer,
        uint256 _quantity
    ) external onlySupplier {
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _manufacturer,
            _quantity,
            msg.sender
        );
        emit ProductAdded(productCount, _name, _manufacturer, _quantity);
    }

    function removeProduct(uint256 _productId) external onlySupplier {
        require(products[_productId].id != 0, "Product does not exist");
        delete products[_productId];
        // Optional: Emit an event for product removal if needed.
    }

    function createShipment(
        uint256 _productId,
        address _destination,
        uint256 _dateOfDeparture,
        uint256 _expectedArrivalDate
    ) external onlyLogisticEmployee {
        require(products[_productId].id != 0, "Product does not exist");
        shipmentCount++;
        shipments[shipmentCount] = Shipment(
            shipmentCount,
            _productId,
            msg.sender,
            _destination,
            _dateOfDeparture,
            _expectedArrivalDate,
            "Created",
            false
        );
        emit ShipmentCreated(
            shipmentCount,
            _productId,
            msg.sender,
            _destination
        );
    }

    function updateShipmentStatus(
        uint256 _transferId,
        string calldata _status
    ) external onlyLogisticEmployee {
        require(
            shipments[_transferId].transferId != 0,
            "Shipment does not exist"
        );
        shipments[_transferId].status = _status;
        emit ShipmentStatusUpdated(_transferId, _status);
    }

    function markShipmentAsDelivered(
        uint256 _transferId
    ) external onlyLogisticEmployee {
        require(
            shipments[_transferId].transferId != 0,
            "Shipment does not exist"
        );
        shipments[_transferId].delivered = true;
        emit ShipmentDelivered(_transferId);
    }

    function getProductDetails(
        uint256 _productId
    ) external view returns (Product memory) {
        return products[_productId];
    }

    function getShipmentDetails(
        uint256 _transferId
    ) external view returns (Shipment memory) {
        return shipments[_transferId];
    }
}
