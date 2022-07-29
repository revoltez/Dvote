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
const [registered, setRegistered] = useState(false);
const [loginOpened, setLoginOpened] = useState(false);

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
    if(username)
    {
        showNotification({title:"Dvote",message:"welcome "+username});
        setRegistered(true);
      }
    else
    {
      setRegistered(false);
    }
},[username])


useEffect(()=>
{
  switch (registered) {
    case true:
        setHomeOpened(true);      
        setLoginOpened(false);
        break;
  
    case false:
    setTimeout(()=>{
      setLoginOpened(true);  
    },200)
    setHomeOpened(false);
    break;
  }

},[registered])

  if (registered === true)
  {
    return(
<Transition mounted={homeOpened} transition="pop-top-left" duration={1000} timingFunction="ease">
      {(styles) =>
    <div style={styles}>
    <div class="home-body">
      <div class="home-header">
        <div class="logo-container">
          <img id="home-logo" src={logo}></img>
          {/*<input id="search" placeholder="Search Sessions by Owner ID"></input>*/}
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
  }else{
  return (
    <Login instance ={instance} onChange={[setInfo,setUserName,setUri,setHomeOpened]} myAddr={myAddr} loginOpened={loginOpened}/>
  )}
}
