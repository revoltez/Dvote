import React, { Component, useEffect, useState } from 'react'
import Session from './Session';
export default function Sessions({instance,myAddr}) {

const [sessions, setSessions] = useState([]);
let sessionList = sessions.map((elem,index) => <Session key={index} myAddr={myAddr} instance={instance} session={elem}/>);

useEffect(()=>
{
  const fetchSessions =async ()=>
    {
        instance.events.sessionCreated({fromBlock:"0"}).on("data",(evt)=>{handleSessionCreatd(evt)})
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

return (
  <React.Fragment>
  <div class="card-conatiner">
      {sessionList}
  </div>
  </React.Fragment>
  )
}
