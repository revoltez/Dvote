import React, { Component, useEffect, useState } from 'react';

export default function Session({session,myAddr,instance}) {
// get the list of candidates
// fetch if admin or not if yes ==> fetch the list of voters as well
// check voting phase status
  // get the block time and compare with session deadlines
// check if user alreadyCasted his vote
// check if user already participated as voter or as candidate

const [sessionPhase, setSessionPhase] = useState("")
const [winner, setWinner] = useState("");
const [owner, setOwner] = useState(false);
const [joinVoterClassParams, setJoinVoterClassParams] = useState("btn mb-2 btn-warning text-white visible");
const [joinCandidateClassParams, setCandidateClassParams] = useState("btn mb-2 btn-danger text-white visible");
// only approved voter and approved candidates
const [participants, setParticipants] = useState([]);
const [joinVRequest, setJoinVRequest] = useState([]);
const [joinCRequest, setJoinCRequest] = useState([]);

// each time you get joinCRequest or joinVRequest event, you compare it with the lis of participants and add it
// only if element doesnt exist
useEffect(()=>
{
  console.log("detected new joinCandidateRequest");

},[joinCRequest]);

useEffect(()=>
{
  console.log("detected new joinVotingRequest");
},[joinVRequest])

useEffect(()=>
{
  // both admin and normal participant should see the list of candidates
  instance.events.candidateApproved({fromBlock:0}).on("data",(evt=>
    {
      console.log("should setType as approvedCandidate",evt);
    }));  
    
  instance.events.voterApproved({fromBlock:0}).on("data",(evt=>
    {
      console.log("should setType as approvedVoter",evt);
    }));  
    
  if(myAddr === session.owner)
  {
    setOwner(true);
    // update the participants list to set the votingSesisonRequests and candidates SessionRequest 
    // such that only not approved users get added t participants list
    instance.events.joinSessionVoterRequest({fromBlock:0}).on("data",(evt=>
    {
      console.log("Should set Type as voterSessionRequest",evt);
    }));
    instance.events.joinSessionCandidateRequest({fromBlock:0}).on("data",(evt=>
    {
      console.log("Should set Type as voterSessionRequest",evt);
    }));    
  }


},[]);

    return (
      <div class="row">
            <div class="col-4 border card">
              <div class="card-body">
                <p class="card-title p-2 w-100">Session#{session.id}</p>
                <p class="card-text p-2 w-100">{session.info}</p>
            </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Candidates size:{session.maxCandidateSize}</li>
                    <li class="list-group-item">voters size:{session.maxVotersSize}</li>
                    <li class="list-group-item">Phase:{sessionPhase}</li>
                </ul>
            <div class="card-body">
              <div class={joinVoterClassParams}>Register as voter</div>
              <div class={joinCandidateClassParams}>Register as candidate</div>
            </div>  
            </div>
      </div> 
      );
}
