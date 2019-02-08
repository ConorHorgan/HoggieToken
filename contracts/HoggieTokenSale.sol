pragma solidity ^0.5.1;

import "./HoggieToken.sol";

contract HoggieTokenSale {
	address admin;
	HoggieToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address _buyer, uint256 _amount);
	
	constructor(HoggieToken _tokenContract, uint256 _tokenPrice) public {
	admin =	msg.sender;
	tokenContract = _tokenContract;
	tokenPrice = _tokenPrice;
}

	// multiply
	function multiply(uint x, uint y) internal pure returns (uint z) {
		require(y == 0 || (z = x * y) / y == x);
	}

	// buy tokens
	function buyTokens(uint256 _numberOfTokens) public payable {
	require(msg.value == _numberOfTokens * tokenPrice);
	require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
	require(tokenContract.transfer(msg.sender, _numberOfTokens));


	tokensSold += _numberOfTokens;

	// keep track of tokens sold
	// trigger sell event
	emit Sell(msg.sender, _numberOfTokens);

	}


	// ending token HoggieTokenSale
	function endSale() public {
	// require admin
	require(msg.sender == admin);
	require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
	selfdestruct(msg.sender);

	}
}