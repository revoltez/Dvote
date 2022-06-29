import React, { Component, useEffect, useState } from 'react';
import Participant from './Participant';
export default function Session({session,myAddr,instance}) {

async function checkRegisteredStatus(addr)
{
  let result = await instance.methods.isRegistered(session.id,addr).call();
  return result;
}

const [sessionPhase, setSessionPhase] = useState("")
const [winner, setWinner] = useState("");
const [registered, setRegistered] = useState(null);
const [owner, setOwner] = useState(false);
// only approved voter and approved candidates
const [participants, setParticipants] = useState([]);
const [joinVoterClassParams, setJoinVoterClassParams] = useState("btn mb-2 btn-warning text-white visible");
const [joinCandidateClassParams, setjoinCandidateClassParams] = useState("btn mb-2 btn-danger text-white visible");
const [winnerClassParams, setWinnerClassParams] = useState("list-group-item invisible");

let participantList = participants.map((elem,index)=> <Participant instance={instance} owner={owner} myAddr={myAddr} session={session} sessionphase={sessionPhase} key={index} participant={elem}/>);

// this could be modified depending ton how you treat cases of equality
const countWinner = async ()=>
{
  let winningCandidate = {name:"",count:0};
  console.log(participants);
  participants.forEach(async (p)=>{
  {
    console.log("p address::",p.id);
    let count = await instance.methods.getVoteCount(session.id,p.id).call();
    if (winningCandidate.count <= count)
    {
      winningCandidate.name = p.name;
    } 
  }
  setWinner(winningCandidate.name);
  setWinnerClassParams("list-group-item visible");
})
}

useEffect(()=>
{
  switch (sessionPhase)
  {
    case "Registration":
    break;
    case "Voting":
      setJoinVoterClassParams("btn mb-2 btn-warning text-white invisible");
      setjoinCandidateClassParams("btn mb-2 btn-warning text-white invisible");
    break;
    case "Locked":
      // count the votes and display winner
      setJoinVoterClassParams("btn mb-2 btn-warning text-white invisible");
      setjoinCandidateClassParams("btn mb-2 btn-warning text-white invisible");
      countWinner();
    break;  
  }
},[sessionPhase,participants])

useEffect(()=>
{
  if(myAddr === session.owner)
  {
    setOwner(true);
    
    //remove voter from the list of participants if he exists and update candidate status to approved if he exists
    instance.events.voterApproved({fromBlock:0,filter:{sessionID:session.id}}).on("data",(evt=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {

      let found = participants.some(p=> p.id === evt.returnValues.voter)
      if(found === true)
      {
        console.log("should remove element from list");
      }
    }}));  
    instance.events.candidateApproved({fromBlock:0,filter:{sessionID:session.id}}).on("data",(async evt=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {
      let candidate = await instance.methods.participants(evt.returnValues.candidate).call();
      const found = participants.some(p=> parseInt(p.id) === parseInt(candidate.id));
      if(found===false)
      {
        candidate.status= "approved";
        setParticipants(prev=> [...prev,candidate]);      
      }
    }}));
    
    
    instance.events.joinSessionVoterRequest({fromBlock:0,filter:{sessionID:parseInt(session.id)}}).on("data",(async (evt)=>
    {
      //workAround since filter does not work properly
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {

          let voterAddr = evt.returnValues.user;
          let result = await checkRegisteredStatus(voterAddr);
          switch (result.status) {
            case (false):
              let participant = await instance.methods.participants(voterAddr).call();
              participant.type= "voter";
              participant.status= "not Approved";
              setParticipants(prev => [...prev,participant]);
              break;
      }
    }
    }));
  
    instance.events.joinSessionCandidateRequest({fromBlock:0,filter:{sessionID:session.id}}).on("data",async (evt)=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID)){
          let candidateAddr = evt.returnValues.user;
          let result = await checkRegisteredStatus(candidateAddr);
          switch (result.status) {
            case (false):
              let participant = await instance.methods.participants(candidateAddr).call();
              participant.type="candidate";
              setParticipants(prev => [...prev,participant]);
              break;
    }}});
  
  }else
  {
    instance.events.candidateApproved({fromBlock:0,filter:{sessionID:session.id}}).on("data",(async evt=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {
      let candidate = await instance.methods.participants(evt.returnValues.candidate).call();
      setParticipants(prev=> [...prev,candidate]);      
    }}));  

  }
    //get current unix epoch time and compare it with deadline and set handler
    let currentUnixTime = Math.floor((Date.now()/1000));
    if (parseInt(session.votingDeadline) > currentUnixTime)
    {
      if (parseInt(session.registrationDeadline) > currentUnixTime)
      {
          setSessionPhase("Registration");
          let timeLeft =parseInt(session.registrationDeadline) - currentUnixTime;
          setTimeout(()=>
          {
            console.log("voting phase Reached");
            setSessionPhase("Voting");
            setTimeout(()=>{
              console.log("voting phase Ended, Count the votes");
              setSessionPhase('Locked');
            },(parseInt(session.votingDeadline) - parseInt(session.registrationDeadline))*1000);     
          },timeLeft *1000)
      }else
      {
        let timeLeft = parseInt(session.votingDeadline) - currentUnixTime;
        setSessionPhase("Voting");
        setTimeout(()=>
        {
            console.log("voting phase Ended, Count the votes");
            setSessionPhase('Locked');
        },timeLeft*1000);
      }
    }else
    {
      console.log("session Finished");
      console.log("votingDeadline!!",parseInt(session.votingDeadline));
      setSessionPhase("Locked")
    }
},[myAddr]);

const joinSessionAsCandidate = async()=>
{
    await instance.methods.registerCandidate(session.id).send({from:myAddr});
}

const joinSessionAsVoter = async ()=>
{
  await instance.methods.registerVoter(session.id).send({from:myAddr});
}

    return (
      <div class="row border" style={{height:"400px"}}>
            <div class="col-4 border card">
              <div class="card-body">
                <p class="card-title p-2 w-100">Session#{session.id}</p>
                <p class="card-text p-2 w-100">{session.info}</p>
            </div>
                <ul class="list-group">
                    <span class="list-group-item">Candidates size:{session.maxCandidateSize}</span>
                    <li class="list-group-item">voters size:{session.maxVotersSize}</li>
                    <li class="list-group-item">{sessionPhase} Phase</li>
                    <li class={winnerClassParams}>Winning Candidate:{winner}</li>
                </ul>
            <div class="card-body">
              <div class={joinVoterClassParams} onClick={joinSessionAsVoter}>Register as voter</div>
              <div class={joinCandidateClassParams} onClick={joinSessionAsCandidate}>Register as candidate</div>
            </div>  
            </div>
            <div class="col border h-100">
              <div class="row"  style={{height:"400px"}}>
              {participantList}
              </div>
            </div>
      </div> 
      );
}
