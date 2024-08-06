const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractABI = [
    // Add your contract ABI here
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

document.getElementById("initiateButton").addEventListener("click", async () => {
    const tokenName = document.getElementById("tokenName").value;
    const tokenSymbol = document.getElementById("tokenSymbol").value;
    const tokenLogo = document.getElementById("tokenLogo").value;
    const ethAmount = document.getElementById("ethAmount").value;

    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    contract.methods.initiateFairLaunch(tokenName, tokenSymbol, tokenLogo).send({
        from: account,
        value: web3.utils.toWei(ethAmount, "ether")
    }).on("receipt", (receipt) => {
        console.log("Fair launch initiated", receipt);
    }).on("error", (error) => {
        console.error("Error initiating fair launch", error);
    });
});

document.getElementById("buyButton").addEventListener("click", async () => {
    const buyAmount = document.getElementById("buyAmount").value;

    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    // WETH 변환 로직 추가
    const wethContractAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH 컨트랙트 주소
    const wethContractABI = [
        {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"payable":true,"stateMutability":"payable","type":"fallback"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}
    ];
    const wethContract = new web3.eth.Contract(wethContractABI, wethContractAddress);

    // ETH를 WETH로 변환
    await wethContract.methods.deposit().send({
        from: account,
        value: web3.utils.toWei(buyAmount, "ether")
    });

    // 토큰 구매
    contract.methods.buyTokens(buyAmount).send({
        from: account
    }).on("receipt", (receipt) => {
        console.log("Tokens purchased", receipt);
    }).on("error", (error) => {
        console.error("Error purchasing tokens", error);
    });
});
