const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
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

    contract.methods.buyTokens(buyAmount).send({
        from: account,
        value: web3.utils.toWei((buyAmount * tokenPrice).toString(), "ether")
    }).on("receipt", (receipt) => {
        console.log("Tokens purchased", receipt);
    }).on("error", (error) => {
        console.error("Error purchasing tokens", error);
    });
});