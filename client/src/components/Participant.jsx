import React, { useEffect, useState } from 'react'
import avatar from "../images/PhotoAvatar.jpg"
export default function Participant({participant,instance,session,myAddr,owner,registered,sessionPhase}) {
  
  // get state of participant and  hange the class params depending on his state
  const [voteClassParams, setVoteClassParams] = useState("vote-btn");
  const [approveClassParams, setApproveClassParams] = useState("invisible");
  const [voted, setVoted] = useState(false);
  useEffect(()=>
  {
    switch (registered)
    {
      case true:
        console.log("got approved to participate in session");
      break;
    }
  },[registered])

useEffect(()=>
  {
    switch (voted) {
      case true:
          setVoteClassParams("invisible");
        break;
      default:
        break;
    }
  },[voted])

useEffect(()=>
{
    switch (sessionPhase) {
      case "Locked":
          setVoteClassParams("invisible");
        break;
    
      default:
        break;
    }
},[sessionPhase])


useEffect(()=>
{
  if (owner)
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
        //setVoteClassParams("invisible");
    }
  }
});

const vote = async()=>
{
  await instance.methods.vote(session.id,participant.id).send({from:myAddr});
  setVoted(true);
}

const approve= async()=>
{
    switch (participant.type) {
      case "voter":
          await instance.methods.approveVoter(session.id,participant.id).send({from:myAddr});
          setVoteClassParams("vote-btn")
        break;
      case "candidate":
          await instance.methods.approveCandidate(session.id,participant.id).send({from:myAddr});
          setVoteClassParams("vote-btn")
      default:
        break;
    }  
}

  return (

<div class="participant-card">
  <div class="card-heading">
    <img src={participant.imgURI} placeholder={avatar} alt="Card image"/>
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
    </div>
  </div>
</div>
  )
}
