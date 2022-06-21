// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract SimpleStorage {
    uint8 storedData;

    function set(uint8 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
