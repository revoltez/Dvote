import React from 'react'
import avatar from "../images/PhotoAvatar.jpg"
export default function Participant({participant}) {
  return (

<div class="card col" style={{height:"400px"}}>
  <img class="card-img-top"   src={avatar} alt="Card image"/>
  <div class="card-body">
    <h4 class="card-title">{participant.name}</h4>
    <p class="card-text">
        {participant.info}
    </p>
    <a href="#" class="btn btn-primary">See Profile</a>
  </div>
</div>
  )
}
