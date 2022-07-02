import React from 'react'
import { useState } from 'react'
import "../styles/participantList.css"

export default function Participants({list}) {
  return (
    <div class="participant-list-container">{list}</div>
  )
}
