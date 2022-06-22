import React, { Component } from 'react'


export default function Login({instance,onChange}) {
const [setInfo,setName,setUri] = onChange;

const register = async (event)=>
{
  //let result = await instance.methods.register() 
  event.preventDefault(); 

  setName(event.target.username.value);
  setInfo(event.target.info.value);
  setUri(event.target.uri);
}

return (
    <div class="container mt-5" >
      <p>Dvote is a decentralized voting system built to be Open, flexible and secure</p>
      <form onSubmit={(event)=>{register(event)}}>
      <div class="input-group d-flex mt-3">
      <input class="form-control border" placeholder="profile picture URI " name="uri" type="url"></input>
      <input class="form-control border" placeholder="Personal informatiion" name="info" type="text"></input>
      <input class="form-control border" placeholder="UserName" name="username" type="text"></input>
      <button class="btn-info form-control text-center text-white" type="submit">Register</button>
      </div>
      </form>
    </div>
  );
}
