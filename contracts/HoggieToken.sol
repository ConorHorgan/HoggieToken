pragma solidity ^0.5.1;

contract HoggieToken {
	//Name
	string public name = "Hoggie Coin";
	//Symbol
	string public symbol =  "HOGGIE";
	//Standard
	string public standard =  "Hoggie Coin v1.0";
	// Constructor
	// Set the total number of tokens
	// Read the total number of tokens
	uint256 public totalSupply;

	event Transfer(
	address indexed _from,
	address indexed _to,
	uint256 _value
	);

	// Approval
	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);

	mapping(address => uint256) public balanceOf;
	// Allowance
	mapping(address => mapping(address => uint256)) public allowance;

	constructor(uint256 _initialSupply) public {
		//allocate the initial supply
		balanceOf[msg.sender] = _initialSupply; 
		totalSupply = _initialSupply;
	}

	//Transfer
	function transfer(address _to, uint256 _value) public returns (bool success) {
		//Exception if account doesn't have enough
		require(balanceOf[msg.sender] >= _value);
		//Transfer the balance
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		emit Transfer(msg.sender, _to, _value);

		return true;
		//Return a boolean
		//Transfer Event
	}

	// Delegated Transfer
	//Approval
	function approve(address _spender, uint256 _value) public returns (bool success) {
		// Allowance
		allowance[msg.sender][_spender] = _value;

		//Approval event
		emit Approval(msg.sender, _spender, _value);

		return true;
	}

	//Transfer From
	 function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
	 require(_value <= balanceOf[_from]);
	 require(_value <= allowance[_from][msg.sender]);
	 
	 // change the balance
	 balanceOf[_from] -= _value;
	 balanceOf[_to] += _value;

	 allowance[_from][msg.sender] -= _value;
	 emit Transfer(_from, _to, _value);

	 return true;

	 }

}