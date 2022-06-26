import React from 'react'
import create_session from "../icons/create-session.png"

export default function SessionModal({instance,myAddr}) {
  
const createSession = async (event)=>
  {
    event.preventDefault(); 
    await instance.methods.createSession(
        event.target.info.value,
        event.target.registrationDeadline.value,
        event.target.votingDeadline.value,
        event.target.maxVotersSize.value,
        event.target.maxCandidateSize.value,
    ).send({from:myAddr});
}

return (
<React.Fragment>
  <div class="row btn border border-primary" data-toggle="modal" data-target="#exampleModalCenter">
      <img class="column" src={create_session}></img>
  <div class="row">
  <button type="button" class="btn btn-primary ml-2 mr-2">create Session</button>
  </div>
  </div>
  <div class="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Create Dvote Session</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
    <div class="container">
    <form onSubmit={(event)=>{createSession(event)}}>
    <div class="form-group" >    
        <input class="form-control border" placeholder="Session General Information " name="info" type="text"></input>
        <input class="form-control border mt-2" placeholder="maximum voters size" name="maxVotersSize" type="number"></input>
        <input class="form-control border mt-2" placeholder="maximum candidate size" name="maxCandidateSize" type="number"></input>
        <input class="form-control border mt-2" placeholder="Registration Deadline" name="registrationDeadline" type="number"></input>
        <input class="form-control border mt-2" placeholder="Voting Deadline" name="votingDeadline" type="number"></input>
        <button class="btn-warning text-white form-control mt-2 mb-3" type="submit">Create Session</button>
    </div>    
    </form>
    </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</React.Fragment>
  )
}
