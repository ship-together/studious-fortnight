// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

contract BuilderRegistry {
    struct Builder {
        string handle;
        uint256 shippedCount;
        bool registered;
    }

    mapping(address => Builder) public builders;
    address[] public builderList;

    event BuilderRegistered(address indexed account, string handle);
    event ProjectShipped(address indexed account, uint256 totalShipped);

    function register(string calldata handle) external {
        require(!builders[msg.sender].registered, "Already registered");
        require(bytes(handle).length > 0, "Handle required");
        builders[msg.sender] = Builder(handle, 0, true);
        builderList.push(msg.sender);
        emit BuilderRegistered(msg.sender, handle);
    }

    function recordShip() external {
        require(builders[msg.sender].registered, "Register first");
        builders[msg.sender].shippedCount += 1;
        emit ProjectShipped(msg.sender, builders[msg.sender].shippedCount);
    }

    function totalBuilders() external view returns (uint256) {
        return builderList.length;
    }
}
