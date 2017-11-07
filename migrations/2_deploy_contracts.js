var Votrice = artifacts.require("./Votrice.sol");

module.exports = function(deployer) {
    deployer.deploy(Votrice);
};
