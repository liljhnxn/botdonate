// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BotDonate
 * @notice Transparent native BOT donation campaign contract on Botchain Mainnet.
 */
contract BotDonate is ReentrancyGuard {
    address public immutable owner;
    string public title;
    string public description;
    uint256 public totalDonated;
    uint256 public donationCount;

    // Events
    event DonationReceived(address indexed donor, uint256 amount);
    event DonationWithdrawn(address indexed owner, uint256 amount);

    // Custom errors
    error ZeroOwnerAddress();
    error ZeroDonationAmount();
    error NotCampaignOwner();
    error NoBalanceToWithdraw();
    error TransferFailed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotCampaignOwner();
        _;
    }

    /**
     * @param _owner Campaign owner authorized to withdraw funds
     * @param _title Title of the donation campaign
     * @param _description Description of the donation campaign
     */
    constructor(
        address _owner,
        string memory _title,
        string memory _description
    ) {
        if (_owner == address(0)) revert ZeroOwnerAddress();
        owner = _owner;
        title = _title;
        description = _description;
    }

    /**
     * @notice Donate native BOT to the campaign
     */
    function donate() external payable {
        if (msg.value == 0) revert ZeroDonationAmount();

        totalDonated += msg.value;
        donationCount += 1;

        emit DonationReceived(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw accumulated balance to the campaign owner
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoBalanceToWithdraw();

        emit DonationWithdrawn(owner, balance);

        (bool success, ) = owner.call{value: balance}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Returns campaign details
     */
    function getCampaignInfo()
        external
        view
        returns (
            address campaignOwner,
            string memory campaignTitle,
            string memory campaignDescription,
            uint256 totalAmountDonated,
            uint256 totalDonationCount
        )
    {
        return (owner, title, description, totalDonated, donationCount);
    }

    /**
     * @notice Returns the current native BOT balance held by the contract
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
