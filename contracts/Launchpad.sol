// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
}

contract Launchpad {
    IWETH public weth;
    address public multiSigWallet;
    address public tokenIssuer;
    uint256 public tokenPrice;
    uint256 public maxTokensToBuy;
    uint256 public totalTokens;
    uint256 public tokensSold;
    uint256 public tokensReserved;
    string public tokenName;
    string public tokenSymbol;
    string public tokenLogo;

    event TokenPurchased(address indexed buyer, uint256 amount);
    event TokenCreated(string name, string symbol, string logo);

    constructor(address _weth, address _multiSigWallet, uint256 _tokenPrice, uint256 _maxTokensToBuy) {
        weth = IWETH(_weth);
        multiSigWallet = _multiSigWallet;
        tokenPrice = _tokenPrice;
        maxTokensToBuy = _maxTokensToBuy;
    }

    function initiateFairLaunch(string memory _name, string memory _symbol, string memory _logo) external payable {
        require(msg.value > 0, "Send ETH to initiate fair launch");
        require(bytes(tokenName).length == 0, "Token already created");

        tokenIssuer = msg.sender;
        tokenName = _name;
        tokenSymbol = _symbol;
        tokenLogo = _logo;

        uint256 totalEth = msg.value;
        uint256 multiSigShare = (totalEth * 40) / 100;
        uint256 fairLaunchShare = (totalEth * 30) / 100;
        uint256 reserveShare = totalEth - multiSigShare - fairLaunchShare;

        totalTokens = totalEth / tokenPrice;
        tokensSold = 0;
        tokensReserved = (totalTokens * 30) / 100;

        weth.deposit{value: totalEth}();
        payable(multiSigWallet).transfer(multiSigShare);

        emit TokenCreated(_name, _symbol, _logo);
    }

    function buyTokens(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= maxTokensToBuy, "Amount exceeds max tokens to buy");
        require(tokensSold + amount <= totalTokens - tokensReserved, "Not enough tokens available");

        uint256 cost = amount * tokenPrice;
        require(msg.value >= cost, "Not enough ETH sent");

        tokensSold += amount;
        weth.deposit{value: msg.value}();

        emit TokenPurchased(msg.sender, amount);
    }

    receive() external payable {}
}