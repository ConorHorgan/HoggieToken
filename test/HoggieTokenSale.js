var HoggieToken = artifacts.require("./HoggieToken.sol");
var HoggieTokenSale = artifacts.require("./HoggieTokenSale.sol");

contract('HoggieTokenSale', function(accounts) {
	var tokenInstance;
	var tokenSaleInstance;
	var admin = accounts[1];
	var buyer = accounts[1];
	var tokenPrice = 1000000000000000; //in wei
	var tokensAvailable = 75000;
	var numberOfTokens;

	it('initializes the contract with the correct values');
	return HoggieTokenSale.deployed().then(function(instance) {
		tokenSaleInstance = instance;
		return tokenSaleInstance.address
	}).then(function(address) {
		assert.notEqual(address, 0x0, 'has contract address');
		return tokenSaleInstance.tokenContract();
	}).then(function(address) {
		assert.notEqual(address, 0x0, 'has contract address');	
		return tokenSaleInstance.tokenPrice();
	}).then(function(price) {
		assert.equal(price, tokenPrice, 'token price is correct');
	});

	it('facilitates token buying', function() {
		return HoggieToken.deployed().then(function(instance) {
			// grab token instance first
			tokenInstance - instance;
			return HoggieTokenSale.deployed();
		}).then(function(instance) {
			// then grab token instance
			tokenSaleInstance = instance;
			// provision 75% of all tokens to the token sale
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
		}).then(function(receipt) {
			numberOfTokens = 10;
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
			assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
			return tokenSaleInstance.tokensSold();
		}).then(function(amount) {
			assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
			return tokenInstance.balanceOf(buyer);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), numberOfTokens);
			// try to buy tokens different from the ether value
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
			return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'cannot pruchase more tokens than available');
		
		});
	});

	it('ends token sale', function() {
		return HoggieTokenSale.deployed().then(function(instance) {
			// grab token instance first
			tokenInstance = instance;
			return HoggieTokenSale.deployed();
		}).then(function(instance) {
			// try to end sale from account other than the admin
			return tokenSaleInstance.endSale({ from: buyer });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
			// end sale as admin
			return tokenSaleInstance.endSale({ from: admin });
		}).then(function(receipt) {
			return tokenInstance.balanceOf(admin);
		}).then(function(balance) {
			assert.equal(balanceOf.toNumber(), 999990, 'returns all unsold hoggie tokens to admin');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price) {
			assert.equal(price.toNumber(), 0, 'token price was reset');
		});
	});
});