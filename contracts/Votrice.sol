pragma solidity ^0.4.15;

/// @title Vote for the best DAPP
contract Votrice {

// voter structure
struct Voter {
    bool voted; // has voted ?
    uint vote; // index of the choice
    bool added; // has added his project ?
}

// project stucture
struct Project {
    string name; // name of the project
    uint count; // number of votes for this project
}

// creator of the contract
address public creator;
// voters
mapping(address => Voter) public voters;
// choices
Project[] public choices;
// winners index
uint[] public winners;

// constructor
function Votrice() public {
    creator = msg.sender;
}

// function to add contestants
function addChoice(string myName) public {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted && !sender.added);
    choices.push(Project({
        name: myName,
        count: 0
    }));
    sender.added = true;
}

// get sender address
function getSenderAddress() public constant returns (address) {
    return msg.sender;
}

// get contract address
function getContractAddress() public constant returns (address) {
    return this;
}

// function to vote for someone
function vote(uint myChoice) public {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted && myChoice <= choices.length && myChoice > 0);
    sender.voted = true;
    sender.vote = myChoice;
    choices[myChoice - 1].count += 1;
}

// function to check if the sender has voted
function didVote(address caller) public constant returns (bool hasVoted) {
    Voter memory sender = voters[caller];
    if (sender.voted == true) {
        return true;
    } else {
        return false;
    }
}

// function to check if the sender has voted
function didAdd(address caller) public constant returns (bool hasAdded) {
    Voter memory sender = voters[caller];
    if (sender.added == true) {
        return true;
    } else {
        return false;
    }
}

// function to get the most voted choice
function getWinners() public returns (uint[]) {
    uint winningCount = 0;
    for (uint i = 0; i < choices.length; i++) {
        if (choices[i].count == winningCount) {
            winners.push(i);
        }
        if (choices[i].count > winningCount) {
            winningCount = choices[i].count;
            winners = [i];
        }
    }
    return winners;
}

// function to destroy the contract and get back the funds
function kill() public {
    if (msg.sender == creator) {
        selfdestruct(creator);
    }
}

// END
}