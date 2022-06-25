import React, { Component, useEffect, useState } from 'react'
import Session from './Session';

export default function Sessions({instance,myAddr}) {

const [sessions, setSessions] = useState([]);  
  const createSession = async (event)=>
  {
    event.preventDefault(); 
    await instance.methods.createSession(
        event.target.info.value,
        event.target.registrationDeadline.value,
        event.target.votingDeadline.value,
        event.target.maxVotersSize.value,
        event.target.maxCandidateSize.value,
    ).send({from:myAddr});

}

useEffect(()=>
{
  const fetchSessions =async ()=>
    {
        instance.events.sessionCreated({fromBlock:"0"},(err,evt)=>{
          console.log("received event",evt);
        }).on("data",async (evt)=>{ handleSessionCreatd(evt)})
    }
    fetchSessions();
},[]);


const handleSessionCreatd =async (event)=>
{
    let index = event.returnValues.id -1;
    let session = await instance.methods.sessions(index).call();
    console.log(session);
}

  return (
    <div class="container">
    <form onSubmit={(event)=>{createSession(event)}}>
    <div class="form-group" >    
        <input class="form-control border" placeholder="Session General Information " name="info" type="text"></input>
        <input class="form-control border mt-2" placeholder="maximum voters size" name="maxVotersSize" type="number"></input>
        <input class="form-control border mt-2" placeholder="maximum candidate size" name="maxCandidateSize" type="number"></input>
        <input class="form-control border mt-2" placeholder="Registration Deadline" name="registrationDeadline" type="number"></input>
        <input class="form-control border mt-2" placeholder="Voting Deadline" name="votingDeadline" type="number"></input>
        <button class="btn-warning text-white form-control mt-2" type="submit">Create Session</button>
    </div>    
    </form>
    </div>
  )
}
