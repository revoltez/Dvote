import React, { Component, useEffect, useState } from 'react';
import Login from './Login';
import Sessions from './Sessions';
//checks whether user has loged in or not, if user has not logged in redirect to loginscreen
export default function HomeScreen({web3,accounts,instance}) {
const [username, setUserName] = useState(null);
const [info, setInfo] = useState(null);
const [uri, setUri] = useState(null);

const [registered, setRegistered] = useState(false);
useEffect(() => {
    const init= async()=>
    {
      let participant= await instance.methods.participants(accounts[0]).call();
      if (participant.registered=== true){
         setRegistered(true)
         setUserName(participant.name);
         setInfo(participant.info);
         setUri(participant.imgURI); 
        }
    }
    init();
}, []);


  if (registered === false)
  {
    return(<Login instance ={instance} username={username} info={info} uri={uri} onChange={[setInfo,setUserName,setUri]} myAddr={accounts[0]} setRegistered={setRegistered}/>)
  }
  return (
    <div>
        welcome {username}
    <Sessions instance={instance} myAddr={accounts[0]}/>
    </div>
  )
}
