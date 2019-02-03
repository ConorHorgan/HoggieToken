var HoggieToken = artifacts.require("./HoggieToken.sol");	

module.exports = function(deployer) {
  deployer.deploy(HoggieToken);
};
