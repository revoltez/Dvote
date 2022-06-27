import React from 'react'

export default function Participant({participant}) {
  return (
      <div class="col-2 border">
        {participant.info}
    </div>
  )
}
