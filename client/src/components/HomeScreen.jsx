import React, { Component, useEffect, useState } from 'react';
import Login from './Login';

//checks whether user has loged in or not, if user has not logged in redirect to loginscreen
export default function HomeScreen({web3,accounts,instance}) {
const [name, setName] = useState(null);
const [info, setInfo] = useState(null);
const [uri, setUri] = useState(null);

const [registered, setRegistered] = useState(false);
useEffect(() => {
    const init= async()=>
    {
      let participant= await instance.methods.participants(accounts[0]).call();
      if (participant.registered=== true){ setRegistered(true)}
    }
    init();
}, []);

console.log("Username changed to",name);

  if (registered === false)
  {
    return(<Login instance ={instance} onChange={[setInfo,setName,setUri]}/>)
  }
  return (
    <div>
        welcome back
    </div>
  )
}
