// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error Not_Enough_Fund();

contract YellowCat {
    event sended(string message);
    event funded(uint amount);
    event newMember(string _name);
    event fundsTransfer(uint256 _amount);

    mapping(address => bool) private isMember;
    mapping(address => string) private addressToName;
    mapping(string => bool) private nameExistsAllready;

    // member name => member name => msg
    mapping(string => mapping(string => string[])) private conversationFromTo;
    mapping(string => mapping(string => uint[])) private conversationTimeStamp;

    // test name aud addr pointer;
    mapping(string => address) public nameToAddr;

    // the funds tansfer part
    mapping(address => uint256) private addrToAmount;

    string private str;
    string[] members;
    mapping(string => string[]) private fullConversation;
    uint private latestTime;

    // becoming member of the room
    function subscribe(string memory _name) public payable onlyNewName(_name) {
        require(msg.value == 0, "Not enough Fees");

        members.push(_name);
        isMember[msg.sender] = true;
        addressToName[msg.sender] = _name;
        nameToAddr[_name] = msg.sender;
        nameExistsAllready[_name] = true;

        emit newMember(_name);
    }

    // use fct addrToName
    function sendMessage(
        string memory _from,
        string memory _to,
        string memory _msg
    ) public {
        conversationFromTo[_from][_to].push(_msg);
        conversationTimeStamp[_from][_to].push(block.timestamp);
        latestTime = block.timestamp;
        emit sended(_msg);
    }

    function fund() public payable {
        addrToAmount[msg.sender] += msg.value;
        emit funded(msg.value);
    }

    function transferFunds(address payable _to) public payable {
        if (addrToAmount[msg.sender] < msg.value) {
            revert Not_Enough_Fund();
        }
        _to.transfer(msg.value);
        addrToAmount[msg.sender] -= msg.value;
        addrToAmount[_to] += msg.value;
        emit fundsTransfer(msg.value);
    }

    // the getters

    function getMembers() public view returns (string[] memory) {
        return members;
    }

    function addrToName(address _addr) public view returns (string memory) {
        return addressToName[_addr];
    }

    function getFullConversation(string memory _from, string memory _to)
        public
        view
        returns (string[] memory, uint[] memory)
    {
        return (
            conversationFromTo[_from][_to],
            conversationTimeStamp[_from][_to]
        );
    }

    function getTime() public view returns (uint) {
        return latestTime;
    }

    function getAdrr(string memory _name) public view returns (address) {
        return nameToAddr[_name];
    }

    function getBalance(string memory _name) public view returns (uint256) {
        return addrToAmount[nameToAddr[_name]];
    }

    //the modifiers
    modifier onlyNewName(string memory _name) {
        require(!nameExistsAllready[_name], "Please pick an other name !!");
        require(!isMember[msg.sender], " please connect with other addr");
        _;
    }
}
