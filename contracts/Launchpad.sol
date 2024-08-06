// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LaunchpadToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}

contract Launchpad {
    address public multiSigWallet = 0xYourMultiSigWalletAddress; // 하드코딩된 멀티시그 지갑 주소
    uint256 public constant totalSupply = 1000000 * 10**18; // 예: 1,000,000 토큰
    uint256 public constant fairLaunchAllocation = (totalSupply * 30) / 100; // 30% 판매
    uint256 public constant reserveAllocation = (totalSupply * 30) / 100; // 30% 유동성 풀 보유
    uint256 public constant multiSigAllocation = (totalSupply * 40) / 100; // 40% 멀티시그 지갑으로 전송
    uint256 public tokenPrice = 0.01 ether; // 토큰당 0.01 WETH
    uint256 public tokensSold;
    LaunchpadToken public token;

    event FairLaunchInitiated(address indexed issuer, address tokenAddress);
    event TokensPurchased(address indexed buyer, uint256 amount);

    constructor() {}

    function initiateFairLaunch(
        string memory name,
        string memory symbol,
        string memory logo
    ) external payable {
        require(token == LaunchpadToken(address(0)), "Fair launch already initiated");
        require(msg.value == multiSigAllocation, "Incorrect ETH amount sent");

        token = new LaunchpadToken(name, symbol, totalSupply);

        // 멀티시그 지갑으로 40% 전송
        payable(multiSigWallet).transfer(msg.value);
        token.transfer(multiSigWallet, multiSigAllocation);

        emit FairLaunchInitiated(msg.sender, address(token));
    }

    function buyTokens(uint256 amount) external payable {
        require(token != LaunchpadToken(address(0)), "Fair launch not initiated");
        require(amount > 0 && amount <= fairLaunchAllocation - tokensSold, "Invalid token amount");
        require(msg.value == amount * tokenPrice, "Incorrect ETH amount sent");

        tokensSold += amount;
        token.transfer(msg.sender, amount);

        emit TokensPurchased(msg.sender, amount);
    }
}
