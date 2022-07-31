import React, { useEffect, useState } from 'react'
import avatar from "../images/Avatar.jpg"
export default function Participant({participant,instance,session,myAddr,owner,registered,sessionPhase,winner,votedState}) {
  
  // get state of participant and  hange the class params depending on his state
  const [voteClassParams, setVoteClassParams] = useState("invisible");
  const [approveClassParams, setApproveClassParams] = useState("invisible");
  const [imgSrcParam, setImgSrcParam] = useState(participant.imgURI);
  const [winnerClassParam, setWinnerClassParam] = useState("invisible"); 
  const [voted, setVoted]= votedState;

  useEffect(()=>
{
  console.log("winner changed::",winner);
  console.log("session changed child ",sessionPhase);
  if(winner !== null){
    switch (sessionPhase) {
      case "Locked":
          setVoteClassParams("invisible");
          switch (winner.id)
          {
            case participant.id:
              setWinnerClassParam("winner");
            break;
          }
          break;
    
      default:
        break;
    }
  }
},[sessionPhase,winner])

useEffect(()=>
{
  if (parseInt(session.owner) ===parseInt( myAddr) )
  {
    if(participant.approved !== true)
    {
          switch (participant.type)
          {
            case "candidate":
              setApproveClassParams("approve-candidate-btn")
              break;
            case "voter":
              setApproveClassParams("approve-voter-btn")
            break;  
          }
        setVoteClassParams("invisible");
    }else
    {
      switch (participant.type) {
        case "candidate":
          setApproveClassParams('invisible');  
            if(voted===false && sessionPhase!=="Locked") {setVoteClassParams("vote-btn");}
            else{
              setVoteClassParams("invisible")}
          break;
        case "voter":
          setApproveClassParams('invisible');  
          setVoteClassParams("invisible");
        break;
      }
    }
  }else
  {
      switch (participant.type) {
        case "candidate":
            setApproveClassParams('invisible');  
            if (voted === false) {setVoteClassParams("vote-btn");}else {setVoteClassParams("invisible")}
          break;
  }
}
},[voted,myAddr]);

const vote = async()=>
{
  await instance.methods.vote(session.id,participant.id).send({from:myAddr})
  setVoteClassParams("invisible");
  setVoted(true);
}

const approve= async()=>
{
    switch (participant.type) {
      case "voter":
          await instance.methods.approveVoter(session.id,participant.id).send({from:myAddr});
          setApproveClassParams("invisible");
          break;
      case "candidate":
          await instance.methods.approveCandidate(session.id,participant.id).send({from:myAddr});
          setVoteClassParams("vote-btn")
          setApproveClassParams("invisible");
          default:
        break;
    }  
}

  return (

<div class="participant-card">
  <div class="card-heading">
    <img src={imgSrcParam} onError={(evt)=>
      {
         setImgSrcParam(avatar);
      }} 
      />
  </div>
  <div class="participant-card-body">
    <div class="participant-title">
      <h4>{participant.name}</h4>
    </div>
    <p class="participant-description">
        {participant.info}
    </p>
    <div class="participant-voting-btns">
    <button href="#" class={voteClassParams} onClick={vote}>Vote</button>
    <button href="#" class={approveClassParams} onClick={approve}>Approve {participant.type}</button>
    <button class={winnerClassParam}>Winner</button>

    </div>
  </div>
</div>
  )
}
