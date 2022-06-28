import React, { useEffect } from 'react'
import avatar from "../images/PhotoAvatar.jpg"
export default function Participant({participant,instance,session,myAddr,owner}) {
  
  // get state of participant and  hange the class params depending on his state
  let voteClassParams = "btn btn-warning text-white visible";
  let approveClassParams = "btn btn-danger text-white invisible";
  let statusClassParams = "text-primary text-white invisible";
  if (owner)
  {
    statusClassParams="text-primary text-white invisible"
    if(participant.status !== "approved")
    {
        approveClassParams = "btn btn-danger ml-2 text-white visible";
    }
  }


  useEffect(()=>
  {

  },[])

const vote = async()=>
{
  await instance.methods.vote(session.id,participant.id).send({from:myAddr});
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
