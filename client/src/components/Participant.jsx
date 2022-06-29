import React, { useEffect, useState } from 'react'
import avatar from "../images/PhotoAvatar.jpg"
export default function Participant({participant,instance,session,myAddr,owner,registered,sessionPhase}) {
  
  // get state of participant and  hange the class params depending on his state
  const [voteClassParams, setVoteClassParams] = useState("btn btn-warning text-white visible");
  const [approveClassParams, setApproveClassParams] = useState("btn btn-danger text-white invisible");
  const [statusClassParams, setStatusClassParams] = useState("text-primary text-white invisible");
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
          setVoteClassParams("btn btn-warning text-white invisible");
        break;
      default:
        break;
    }
  },[voted])

useEffect(()=>
{
    switch (sessionPhase) {
      case "Locked":
          setVoteClassParams("btn btn-warning text-white invisible");
        break;
    
      default:
        break;
    }
},[sessionPhase])


useEffect(()=>
{
  if (owner)
  {
    setStatusClassParams("text-primary text-white invisible")
    if(participant.status !== "approved")
    {
        setApproveClassParams("btn btn-danger ml-2 text-white visible");
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
        break;
      case "candidate":
          await instance.methods.approveCandidate(session.id,participant.id).send({from:myAddr});
      default:
        break;
    }  
}

  return (

<div class="card col" style={{height:"400px"}}>
  <img class="card-img-top" src={""} alt="Card image"/>
  <div class="card-body">
    <h4 class="card-title">{participant.name}</h4>
    <p class="card-text">
        {participant.info}
    </p>
    <p href="#" class={statusClassParams}>Status {participant.status}</p>
    <button href="#" class={voteClassParams} onClick={vote}>Vote</button>
    <button href="#" class={approveClassParams} onClick={approve}>Approve {participant.type}</button>
  </div>
</div>
  )
}
