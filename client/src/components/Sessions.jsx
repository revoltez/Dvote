import React, { Component, useEffect, useState } from 'react'
import Session from './Session';
export default function Sessions({instance,myAddr}) {

const [sessions, setSessions] = useState([]);

useEffect(()=>
{
  const fetchSessions =async ()=>
    {
        instance.events.sessionCreated({fromBlock:parseInt(0)}).on("data",(evt)=>{handleSessionCreatd(evt)})
        .on("error",async(err,receipt)=>{console.log(err)})
    }
    fetchSessions();
},[]);

const handleSessionCreatd =async (event)=>
{
    let index = event.returnValues.id -1;
    let sessionReceipt = await instance.methods.sessions(index).call();
    sessionReceipt.id= index;
    setSessions(prev=> [...prev,sessionReceipt]);
}

let sessionList = sessions.map((elem,index) => <Session key={index} myAddr={myAddr} instance={instance} session={elem}/>);
return (
  
  <div class="session-list-container">
      {sessionList}
  </div>
  )
}
