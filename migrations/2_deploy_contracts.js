const Launchpad = artifacts.require("Launchpad");

module.exports = function (deployer) {
  deployer.deploy(Launchpad);
};
