import React, { Component, useEffect, useState } from 'react'
import Session from './Session';
import SessionModal from './SessionModal';
export default function Sessions({instance,myAddr}) {

const [sessions, setSessions] = useState([]);
let sessionList = sessions.map((elem,index) => <Session key={index} myAddr={myAddr} instance={instance} session={elem}/>);

useEffect(()=>
{
  const fetchSessions =async ()=>
    {
        instance.events.sessionCreated({fromBlock:"0"}).on("data",async (evt)=>{ await handleSessionCreatd(evt)})
        .on("connected",(id)=>{console.log("subsdcribed to event with id ::",id)})  
        .on("error",async(err,receipt)=>{console.log(err)})
    }
    fetchSessions();
},[]);

const handleSessionCreatd =async (event)=>
{
    let index = event.returnValues.id -1;
    let sessionReceipt = await instance.methods.sessions(index).call();
    let session = 
    {
      id: index,
      info : sessionReceipt.info,
      maxCandidateSize:sessionReceipt.maxCandidateSize,
      maxVotersSize:sessionReceipt.maxVotersSize,
      owner:sessionReceipt.owner,
    }
    setSessions(prev=> [...prev,session]);
}

return (
  <React.Fragment>
   <SessionModal instance={instance} myAddr={myAddr}></SessionModal> 
  <h1 class="row">sesions List</h1>
  <div class="conatiner">
      {sessionList}
  </div>
  </React.Fragment>
  )
}
