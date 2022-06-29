import React, { Component } from 'react'
import { Button } from '@mantine/core';

export default function Login({instance,username,info,uri,onChange,myAddr,setRegistered}) {
const [setInfo,setUserName,setUri] = onChange;

const register = async (event)=>
{
  event.preventDefault(); 
  setUserName(event.target.username.value);
  setInfo(event.target.info.value);
  setUri(event.target.uri.value);
    
  await instance.methods.register(event.target.uri.value,event.target.info.value,event.target.username.value).send({from:myAddr});
//listen to participant registered event and pass its value  so that homscreen will rerender instead of reloading
  instance.events.participantRegistered({fromBlock:0,filter:{user:myAddr}},(err,evt)=>
  {
    setRegistered(true)
  });
}

return (
    <div class="container mt-5" >
      <p>Dvote is a decentralized voting system built to be Open, flexible and secure</p>
      <form onSubmit={(event)=>{register(event)}}>
      <div class="input-group d-flex mt-3">
      <input class="form-control border" placeholder="profile picture URI " name="uri" type="text"></input>
      <input class="form-control border" placeholder="Personal informatiion" name="info" type="text"></input>
      <input class="form-control border" placeholder="UserName" name="username" type="text"></input>
      <Button radius="xs" variant="outline" color="violet">Register</Button>
      </div>
      </form>
    </div>
  );
}
