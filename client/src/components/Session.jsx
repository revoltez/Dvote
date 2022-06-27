import React, { Component, useEffect, useState } from 'react';

export default function Session({session,myAddr,instance}) {
// get the list of candidates
// fetch if admin or not if yes ==> fetch the list of voters as well
// check voting phase status
  // get the block time and compare with session deadlines
// check if user alreadyCasted his vote
// check if user already participated as voter or as candidate

async function checkRegisteredStatus(addr)
{
  let result = await instance.methods.isRegistered(session.id,addr).call();
  return result;
}

const setStatus = async (addr)=>
  {
    let result = await checkRegisteredStatus(addr);
    setRegistered(result);
  }

const [sessionPhase, setSessionPhase] = useState("")
const [winner, setWinner] = useState("");
const [registered, setRegistered] = useState(null);
const [owner, setOwner] = useState(false);
// only approved voter and approved candidates
const [participants, setParticipants] = useState([]);
const [joinVRequest, setJoinVRequest] = useState([]);
const [joinCRequest, setJoinCRequest] = useState([]);

const [joinVoterClassParams, setJoinVoterClassParams] = useState("btn mb-2 btn-warning text-white visible");
const [joinCandidateClassParams, setCandidateClassParams] = useState("btn mb-2 btn-danger text-white visible");

// each time you get joinCRequest or joinVRequest event, you compare it with the lis of participants and add it
// only if element doesnt exist
useEffect(()=>
{
},[joinCRequest]);

useEffect(()=>
{
},[joinVRequest])

useEffect(()=>
{
  setStatus(myAddr);
},[participants])


useEffect(() => {
  setStatus(myAddr);
}, [myAddr])


console.log("participants",participants);


useEffect(()=>
{
  // both admin and normal participant should see the list of candidates
  // delete the voter or candidate that is approved from the joinVrequest and JoinCrequest
  instance.events.candidateApproved({fromBlock:0}).on("data",(evt=>
    {
    }));  
    
  instance.events.voterApproved({fromBlock:0}).on("data",(evt=>
    {
    }));  
    
  if(myAddr === session.owner)
  {
    setOwner(true);
  }
    // update the participants list to set the votingSesisonRequests and candidates SessionRequest 
    // such that only not approved users get added t participants list
    // verify if registered with checkregistered
    instance.events.joinSessionVoterRequest({fromBlock:0,filter:{sessionID:session.id}}).on("data",(async (evt)=>
    {
          let voterAddr = evt.returnValues.user;
          let result = await checkRegisteredStatus(voterAddr);
          switch (result.status) {
            case (false):
              let participant = await instance.methods.participants(voterAddr).call();
              participant.type= "voter";
              setParticipants(prev => [...prev,participant]);
              break;
      }
    }));
    instance.events.joinSessionCandidateRequest({fromBlock:0,filter:{sessionID:session.id}}).on("data",async (evt)=>
    {
          let candidateAddr = evt.returnValues.user;
          let result = await checkRegisteredStatus(candidateAddr);
          switch (result.status) {
            case (false):
              let participant = await instance.methods.participants(candidateAddr).call();
              participant.type="candidate";
              setParticipants(prev => [...prev,participant]);
              break;
    }});
},[]);

const joinSessionAsCandidate = async()=>
{
    instance.methods.registerCandidate(session.id).send({from:myAddr});
}

const joinSessionAsVoter = async ()=>
{
  let receipt = await instance.methods.registerVoter(session.id).send({from:myAddr});
}

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
              <div class={joinVoterClassParams} onClick={joinSessionAsVoter}>Register as voter</div>
              <div class={joinCandidateClassParams} onClick={joinSessionAsCandidate}>Register as candidate</div>
            </div>  
            </div>
      </div> 
      );
}
