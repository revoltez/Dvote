// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Dvote {
    session[] public sessions;
    mapping(address => participant) public participants;
    event joinSessionVoterRequest(uint256 sessionID, address user);
    event joinSessionCandidateRequest(uint256 sessionID, address user);
    event voterApproved(address voter);
    event candidateApproved(address candidate);
    event participantRegistered(address user);
    event sessionCreated(uint256 id);
    struct session {
        address payable owner;
        string info;
        uint8 maxVotersSize;
        uint8 maxCandidateSize;
        mapping(address => bool) voters; // bool referr to whether voter is approved by admin to vote or not
        mapping(address => bool) candidates; // bool referr to whether candidate is approved by admin to vote or not
        mapping(address => uint8) votes;
        uint32 registrationDeadline; // must be unix Epoch time
        uint32 votingDeadline;
    }

    struct participant {
        address payable id;
        string imgURI;
        string info;
        string name;
        bool registered; // voters mapping always return a person therefore it is used to make sure that the person queried is not default mapping value
        //mapping(uint8 => bool) registeredInSession; // keep track of all registered in sessions
    }

    function createSession(
        string calldata info,
        uint32 registrationDeadline,
        uint32 votingDeadline,
        uint8 maxVotersSize,
        uint8 maxCandidateSize
    ) public {
        session storage newSession = sessions.push();
        newSession.info = info;
        newSession.registrationDeadline = registrationDeadline;
        newSession.votingDeadline = votingDeadline;
        newSession.owner = payable(msg.sender);
        newSession.maxCandidateSize = maxCandidateSize;
        newSession.maxVotersSize = maxVotersSize;
        emit sessionCreated(sessions.length);
    }

    function register(
        string calldata imgUri,
        string calldata info,
        string calldata name
    ) external {
        // participant storage p = participants.push();
        require(
            participants[msg.sender].registered == false,
            "user already registered in Dvote"
        );
        participants[msg.sender] = participant(
            payable(msg.sender),
            imgUri,
            info,
            name,
            true
        );
        emit participantRegistered(msg.sender);
    }

    /*
    function getParticipant(address user)
    {
        participants[user].registered==true
    }
*/
    modifier registered(address p) {
        require(
            participants[p].registered == true,
            "participant not registered in Dvote"
        );
        _;
    }

    modifier registrationPhase(uint8 sessionID) {
        require(
            block.timestamp < sessions[sessionID].registrationDeadline,
            "Registration Phase expired"
        );
        _;
    }

    // require onlyOwner of the session to add voters
    // require that registration deadline is not expired
    /* require that voter is already registered in dvote 
     and its associated value in the mapping voters doesnt contain default values*/
    function registerVoter(uint8 sessionID)
        external
        registered(msg.sender)
        registrationPhase(sessionID)
    {
        require(
            sessions[sessionID].voters[msg.sender] == false,
            "User already registered in this session"
        );
        emit joinSessionVoterRequest(sessionID, msg.sender);
    }

    function registerCandidate(uint8 sessionID)
        external
        registered(msg.sender)
        registrationPhase(sessionID)
    {
        require(
            sessions[sessionID].candidates[msg.sender] == false,
            "User already registered in this session"
        );
        emit joinSessionCandidateRequest(sessionID, msg.sender);
    }

    function approveVoter(uint8 sessionID, address voter)
        external
        registered(voter)
        registrationPhase(sessionID)
    {
        require(
            msg.sender == sessions[sessionID].owner,
            "sender does not own session"
        );
        require(
            sessions[sessionID].voters[voter] == false,
            "voter already approved"
        );
        sessions[sessionID].voters[voter] = true;
        emit voterApproved(voter);
    }

    function approveCandidate(uint8 sessionID, address candidate)
        external
        registered(candidate)
        registrationPhase(sessionID)
    {
        require(
            msg.sender == sessions[sessionID].owner,
            "sender does not own session"
        );
        require(
            sessions[sessionID].candidates[candidate] == false,
            "candidate already approved"
        );
        sessions[sessionID].candidates[candidate] = true;
        emit candidateApproved(candidate);
    }

    // voter must be registered and approved to vote in that session
    // registration phase must be expired and voting has not ended
    function vote(uint8 sessionID, address candidate)
        external
        registered(msg.sender)
    {
        require(
            sessions[sessionID].registrationDeadline >= block.timestamp &&
                sessions[sessionID].registrationDeadline <=
                sessions[sessionID].votingDeadline,
            "Action not performed during voting phase"
        );
        require(
            sessions[sessionID].voters[msg.sender] == true,
            "voter is not approved by admin to participate in this session"
        );
        sessions[sessionID].votes[candidate] += 1;
    }

    // need to refactor in case equal votes
}
