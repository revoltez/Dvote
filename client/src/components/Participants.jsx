import React, { useRef } from 'react'
import { useState,useEffect } from 'react'
import "../styles/participantList.css"
import Participant from './Participant';

export default function Participants({instance,registered,owner,myAddr,session,sessionPhase,checkRegisteredStatus,votedState}) {

const [participantList, setParticipantList] = useState([]);
const [participants, setParticipants] = useState([]);
const refParticipants =useRef(participants);
const [winner, setWinner] = useState(null);

const countWinner = async ()=>
{
  
  let winningCandidate = {id :0,count:0};
  participants.forEach(async (p,index)=>{
  {
    let count = await instance.methods.getVoteCount(session.id,p.id).call();
    if (winningCandidate.count <= count)
    {
      winningCandidate.id = p.id;
      winningCandidate.count = count;
      console.log("vote count for "+p.name+" is at "+ count);
    } 
  }
  setWinner(prev => winningCandidate);
})
}

useEffect(()=>
{
  console.log("parent changed",winner);
  console.log("session from partifipants",sessionPhase);
},[sessionPhase,winner])

useEffect(()=>
{
  countWinner();
  let list = participants.filter((elem,index)=>
  {
    if(parseInt(myAddr) !== parseInt(session.owner))
    {
      if(elem.approved===false || elem.type==="voter")
      {
        return false;
      }
      else
      {
        return true;
      }
    }else
    {
        if((elem.type ==="voter") && (elem.approved === true))
        {
          return false;
        }else
        {
            return true;
        }        
    }
  });
  
  setParticipantList(list);


},[participants,myAddr])

const checkAndAdd = function checkAndAdd(user)
{

        const found = refParticipants.current.some(p=>
          {
            return(parseInt(p.id) === parseInt(user.id))
          });
        
        if(found===false)
        {
          refParticipants.current = [...refParticipants.current,user]    
          setParticipants(prev=> [...prev,user]);      
        }else
        {
          let index = refParticipants.current.findIndex((p)=> p.id === user.id);
          if (user.approved === true && refParticipants.current.at(index).approved === false)
          {
              let newList = refParticipants.current.map((p)=>
              {
                if( p.id === user.id){                  
                  return {...p,approved:true};
                }
                return p;
              });
              refParticipants.current = newList;
              setParticipants(newList);
          }
        }
}

useEffect(()=>
{
    instance.events.candidateApproved({fromBlock:0,filter:{sessionID:session.id}}).on("data",(async evt=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {
      let candidate = await instance.methods.participants(evt.returnValues.candidate).call();
        candidate.type="candidate"; 
        candidate.approved= true;
        checkAndAdd(candidate);
    }}));
    
    instance.events.voterApproved({fromBlock:0,filter:{sessionID:session.id}}).on("data",(async evt=>
    {
    if (parseInt(session.id) ===parseInt(evt.returnValues.sessionID))
    {
      let voter = await instance.methods.participants(evt.returnValues.voter).call();
        voter.type="voter";
        voter.approved= true;
        checkAndAdd(voter);
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

  },[]);


  return (
    <div class="participant-list-container">{
      participantList.map((elem,index)=> (<Participant instance={instance} registered={registered} owner={owner} myAddr={myAddr} 
      session={session} sessionPhase={sessionPhase} key={index} participant={elem} winner={winner} votedState={votedState}/>)) 
      }

    </div>
  )
}