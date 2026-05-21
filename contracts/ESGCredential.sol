// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ESGCredential is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct ESGRecord {
        string organizationName;
        string actionType;
        string description;
        string impactMetric;
        uint256 timestamp;
    }

    // Mapping from token ID to ESG record metadata
    mapping(uint256 => ESGRecord) private _esgRecords;

    // Events
    event ESGCredentialMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string organizationName,
        string actionType,
        string impactMetric,
        uint256 timestamp
    );

    constructor() ERC721("CarbonChain ESG Credential", "CCESG") Ownable(msg.sender) {}

    /**
     * @dev Mint a new soulbound ESG credential to an enterprise wallet.
     * @param recipient The wallet address of the organization.
     * @param organizationName The name of the organization.
     * @param actionType The category/type of ESG action.
     * @param description A summary of the ESG action details.
     * @param impactMetric The quantified impact metrics.
     */
    function mintCredential(
        address recipient,
        string memory organizationName,
        string memory actionType,
        string memory description,
        string memory impactMetric
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(recipient, tokenId);

        _esgRecords[tokenId] = ESGRecord({
            organizationName: organizationName,
            actionType: actionType,
            description: description,
            impactMetric: impactMetric,
            timestamp: block.timestamp
        });

        emit ESGCredentialMinted(
            tokenId,
            recipient,
            organizationName,
            actionType,
            impactMetric,
            block.timestamp
        );

        return tokenId;
    }

    /**
     * @dev Retrieve full metadata records for a minted credential.
     */
    function getCredentialDetails(uint256 tokenId)
        public
        view
        returns (
            string memory organizationName,
            string memory actionType,
            string memory description,
            string memory impactMetric,
            uint256 timestamp
        )
    {
        // Require token exists (will automatically revert if token is not minted/valid)
        address owner = ownerOf(tokenId);
        require(owner != address(0), "Error: Credential does not exist");

        ESGRecord memory record = _esgRecords[tokenId];
        return (
            record.organizationName,
            record.actionType,
            record.description,
            record.impactMetric,
            record.timestamp
        );
    }

    // --- SOULBOUND RESTRICTIONS (Disable Transfers & Approvals) ---

    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("Error: Credentials are Soulbound and non-transferable");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        revert("Error: Credentials are Soulbound and non-transferable");
    }

    function approve(address to, uint256 tokenId) public override {
        revert("Error: Approvals are disabled for Soulbound credentials");
    }

    function setApprovalForAll(address operator, bool approved) public override {
        revert("Error: Approvals are disabled for Soulbound credentials");
    }
}
