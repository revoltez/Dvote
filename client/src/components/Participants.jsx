import React from 'react'
import { useState,useEffect } from 'react'
import "../styles/participantList.css"
import Participant from './Participant';

export default function Participants({instance,registered,owner,myAddr,session,sessionPhase,checkRegisteredStatus}) {

const [participantList, setParticipantList] = useState([]);
const [participants, setParticipants] = useState([]);

useEffect(()=>
{
  let list = participants.filter((elem,index)=>
  {
    if(parseInt(myAddr) !== parseInt(session.owner))
    {
      if(elem.approved===true)
      {
        return true;
      }
      else
      {
        console.log("element not approved yet");
        return false;
      }
    }else
    {
        console.log("owner!!");
        return true;
    }
  }).map((elem,index)=> <Participant instance={instance} registered={registered} owner={owner} myAddr={myAddr} session={session} sessionPhase={sessionPhase} key={index} participant={elem}/>); 

  setParticipantList(list);

},[participants,myAddr])


function checkAndAdd(user)
{
        const found = participants.some(p=> parseInt(p.id) === parseInt(user.id));
        if(found===false)
        {
          setParticipants(prev=> [...prev,user]);      
        }
}

// should execute only once but since the events dont work i had to 
//reexcute it and get all the vents from the first vlock
useEffect(()=>
{
    instance.events.voterApproved({fromBlock:0,filter:{sessionID:session.id}}).on("data",(async evt=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {
      let voter = await instance.methods.participants(evt.returnValues.voter).call();
        voter.approved= true;
        checkAndAdd(voter);
    }}));  
    instance.events.candidateApproved({fromBlock:0,filter:{sessionID:session.id}}).on("data",(async evt=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {
      let candidate = await instance.methods.participants(evt.returnValues.candidate).call();
        candidate.approved= true;
        checkAndAdd(candidate);
    }}));
    instance.events.joinSessionVoterRequest({fromBlock:0,filter:{sessionID:parseInt(session.id)}}).on("data",(async (evt)=>
    {
      //workAround since filter does not work properly
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {

          let voterAddr = evt.returnValues.user;
          let result = await checkRegisteredStatus(voterAddr);
          switch (result.status) {
            // means that the user has not yet beein approved by session Admin
            case (false):
              let participant = await instance.methods.participants(voterAddr).call();
              participant.type= "voter";
              participant.approved=false;
              checkAndAdd(participant);
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
              participant.approved=false;
              checkAndAdd(participant);
              break;
    }}});
  },[myAddr]);


  return (
    <div class="participant-list-container">{participantList}</div>
  )
}
