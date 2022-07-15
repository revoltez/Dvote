import React, { useEffect, useState } from 'react'
import avatar from "../images/Avatar.jpg"
export default function Participant({participant,instance,session,myAddr,owner,registered,sessionPhase}) {
  
  // get state of participant and  hange the class params depending on his state
  const [voteClassParams, setVoteClassParams] = useState("invisible");
  const [approveClassParams, setApproveClassParams] = useState("invisible");
  const [voted, setVoted] = useState(false);
  const [imgSrcParam, setImgSrcParam] = useState(participant.imgURI);
  
  useEffect(()=>
  {
    const checkVoted = async ()=>
    {
      let result = await instance.methods.voted(session.id,myAddr).call();
      setVoted(result);
    }
    checkVoted();
  },[myAddr])

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
          setVoteClassParams("vote-btn")
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
    </div>
  </div>
</div>
  )
}
