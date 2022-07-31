import React, { Component, useEffect, useState } from 'react'
import { Button } from '@mantine/core';
import "../styles/login.css";
import voting_box from "../images/voting_box.png";
import logo from "../images/logo.png"
import { Transition } from '@mantine/core';
export default function Login({instance,onChange,myAddr,loginOpened}) {
const [setInfo,setUserName,setUri] = onChange;
const register = async (event)=>
{
  event.preventDefault(); 
  await instance.methods.register(event.target.uri.value,event.target.info.value,event.target.username.value).send({from:myAddr});
//listen to participant registered event and pass its value  so that homscreen will rerender instead of reloading
}

useEffect(()=>
{
  instance.events.participantRegistered({fromBlock:0,filter:{user:myAddr}},(err,evt)=>
  {
    if(parseInt(evt.returnValues.user)===parseInt(myAddr))
    {
      let fetchInfo = async()=>
      {
        let participant= await instance.methods.participants(myAddr).call();
         setUserName(participant.name);
         setInfo(participant.info);
         setUri(participant.imgURI);
      }
      fetchInfo();
    }
  });
},[])


return (
<Transition mounted={loginOpened} transition="skew-up" duration={400} timingFunction="ease">
      {(styles) =>
  <div style={styles}> 
  <div class="body">
    <div class="login-container">
      <div class="description-container">
        <img id="logo" src={logo} alt="Dapp Logo" ></img>
        <p>           
          Dvote is a General Decentralized voting Application that is Open, Secure and customizable.
          Register once in DVote so that you could be Able to create or participate in open voting Sessions
        </p>
      </div>
      <div class="form-container">
      <form class="container-form" onSubmit={(event)=>register(event)}>
        <input class="form-input" placeholder="profile picture URI " name="uri" type="text"></input>
        <input class="form-input" placeholder="UserName" name="username" type="text"></input>
        <textarea id="w3review" name="w3review" rows="4" cols="50" class="form-input" placeholder="Introduce your self" name="info" type="text"></textarea>
        <button  class="btn-form" type="submit">Register</button>
      </form>
      </div>
    </div>
  </div>
  </div>
}</Transition>


    /*<div class="container mt-5" >
      <p>Dvote is a decentralized voting system built to be Open, flexible and secure</p>
      <form onSubmit={(event)=>{register(event)}}>
      <div class="input-group d-flex mt-3">
      <input class="form-control border" placeholder="profile picture URI " name="uri" type="text"></input>
      <input class="form-control border" placeholder="Personal informatiion" name="info" type="text"></input>
      <input class="form-control border" placeholder="UserName" name="username" type="text"></input>
      <Button radius="xs" variant="outline" color="violet">Register</Button>
      </div>
      </form>
    </div>*/
  );
}
