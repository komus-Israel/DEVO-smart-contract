pragma solidity 0.8.10;

//  [x]  register voters
//  [x]  get their votes
//  [x]  ensure that they can't vote more than once
//  [x]  ensure that the votes of the apirants are well appended

contract Vote {

    //  a map to store the number of votes submitted to each candidates
    mapping(string => uint256) public candidates;

    //  a struct to save the voter's details on registration
    struct Registration {

        string FirstName;
        string LastName;
        string MiddleName;
        string stateOfOrigin;
        string NIN;
        address registrantAddress;
        uint256 timestamp;

    }

    //  an array of registered addresses
    address[] public registeredAddresses; 

    //  mapping the registered user's details to their address
    mapping(address => Registration) public electorates;


    //  mapping marks addresses as registered
    mapping(address => bool) public registered;

    //  mapping that validates an electorates' vote 
    mapping(address => bool) public validateVote;


     /////   Events
    //  1. Registered event
    //  2. Vote event

    event Registered(string _firstname, string _lastName, address _address, uint256 _timestamp);
    event VoteCandidate(string _candidate, uint256 _timestamp);




    function registerVoter(string memory _firstname, string memory _lastname, string memory _middlename, string memory _stateOfOrigin, string memory _nin) public {

        //  check if the address has been registered
        require(!registered[msg.sender]);

        //  if not registered, add them to the registered users
        registered[msg.sender] = true;
        registeredAddresses.push(msg.sender);  

        //  saving their registration details
        electorates[msg.sender] = Registration(_firstname, _lastname, _middlename, _stateOfOrigin, _nin, msg.sender, block.timestamp);

        //  emit registration event
        emit Registered( _firstname, _lastname , msg.sender, block.timestamp);
  
    }

    function voteCandidate(string memory _candidate) public {

        //  validate that this address is eligible for voting through registration
        require(electorates[msg.sender].registrantAddress == msg.sender);

        //  validate that this address hasn't voted
        require(!validateVote[msg.sender]);
        candidates[_candidate] += 1;

        //  ensures that this address can't vote again
        validateVote[msg.sender] = true;

        //  emit event
        emit VoteCandidate(_candidate, block.timestamp);
    }

    function result(string memory _candidate) public view returns (uint256) {
        return candidates[_candidate];
    }

    function noOfRegisteredVoters() public view returns (uint256) {
        return registeredAddresses.length;
    }
 
    
}