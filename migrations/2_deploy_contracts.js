var HoggieToken = artifacts.require("./HoggieToken.sol");	
var HoggieTokenSale = artifacts.require("./HoggieTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(HoggieToken, 1000000).then(function() {
  	// token price is 0.001 Ether
  	var tokenPrice = 1000000000000000;
	return deployer.deploy(HoggieTokenSale, HoggieToken.address, tokenPrice); 
});
};
