import React, { Component, useEffect, useState } from 'react';
import Login from './Login';
import Sessions from './Sessions';
import SessionModal from './SessionModal';
import logo from "../images/logo.png";
import "../styles/homeScreen.css";
import { Transition } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import create_session from "../icons/create-session.png"

//checks whether user has loged in or not, if user has not logged in redirect to loginscreen
export default function HomeScreen({web3,myAddr,instance}) {
const [username, setUserName] = useState(null);
const [info, setInfo] = useState(null);
const [uri, setUri] = useState(null);
const [homeOpened, setHomeOpened] = useState(false);

const [registered, setRegistered] = useState(true);
useEffect(() => {
      let fetchInfo = async()=>
      {
        let participant= await instance.methods.participants(myAddr).call();
         setUserName(participant.name);
         setInfo(participant.info);
         setUri(participant.imgURI);
      }
      fetchInfo();
}, [myAddr]);

useEffect(()=>
{
  setTimeout(()=>
  {
    if(username)
    {
        setHomeOpened(true);
        showNotification({title:"Dvote",message:"welcome "+username});
        setRegistered(true);
    }
    else
    {
      setHomeOpened(false);
      setRegistered(false);
    }
  },300)
},[username])


  if (registered === true)
  {
    return(
<Transition mounted={homeOpened} transition="pop-top-left" duration={400} timingFunction="ease">
      {(styles) =>
    <div style={styles}>
    <div class="home-body">
      <div class="home-header">
        <div class="logo-container">
          <img id="home-logo" src={logo}></img>
          <input id="search" placeholder="Search Sessions by Owner ID"></input>
        </div>
        <div class="parameters">
          <SessionModal instance={instance} myAddr={myAddr}></SessionModal> 
        </div>
      </div>
    <div class="session-list">
      <Sessions instance={instance} myAddr={myAddr}/>
      </div>
    </div>
    </div>
}</Transition>  )
  }
  return (
    <Login instance ={instance} username={username} info={info} uri={uri} onChange={[setInfo,setUserName,setUri,setHomeOpened]} myAddr={myAddr} setRegistered={setRegistered}/>
  )
}
