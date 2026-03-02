// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BuildSealAnchor {

    event Anchored(
        bytes32 indexed merkleRoot,
        uint256 indexed batchId,
        bytes32          metaHash,
        address          sender
    );

    mapping(bytes32 => uint256) public anchoredAt;

    function anchor(
        bytes32 merkleRoot,
        uint256 batchId,
        bytes32 metaHash
    ) external {
        require(merkleRoot != bytes32(0), "BuildSeal: zero root");
        if (anchoredAt[merkleRoot] == 0) {
            anchoredAt[merkleRoot] = block.timestamp;
        }
        emit Anchored(merkleRoot, batchId, metaHash, msg.sender);
    }

    function isAnchored(bytes32 merkleRoot) external view returns (bool) {
        return anchoredAt[merkleRoot] != 0;
    }
}
