import React, { useState } from 'react'
import { Modal,useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import moment from "moment";
export default function SessionModal({instance,myAddr}) {
  
const [open, setOpen] = useState(false);
const theme = useMantineTheme();
const createSession = async (event)=>
  {
    event.preventDefault(); 
    let registrationDeadline = Math.floor(new Date(event.target.registrationDeadline.value)/1000) //.getSeconds();
    let votingDeadline = Math.floor(new Date(event.target.votingDeadline.value)/ 1000 )//.getSeconds();
    await instance.methods.createSession(
        event.target.info.value,
        registrationDeadline,
        votingDeadline,
        event.target.maxVotersSize.value,
        event.target.maxCandidateSize.value,
    ).send({from:myAddr});
    setOpen(false);
    showNotification(
      {
        title:"Dvote",
        message:"Session Request created Successfully"
      })
      console.log(registrationDeadline)
}

return (
<React.Fragment>
<div class="modal">
 <button class="btn-form" onClick={()=>{setOpen(true)}}>Create Session</button>
 <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Create Session"
        transition="skew-up"
        transitionDuration={400}
        transitionTimingFunction="ease"
        size="70%"
      overlayColor='dark'
      overlayOpacity={0.55}
      overlayBlur={3}
      >
    <form class="container-form" onSubmit={(event)=>{createSession(event)}}>
        <textarea class="form-input" placeholder="Session General Information " name="info" type="text"></textarea>
        <input class="form-input" placeholder="maximum voters size" name="maxVotersSize" type="number"></input>
        <input class="form-input" placeholder="maximum candidate size" name="maxCandidateSize" type="number"></input>
        <input class="form-input" placeholder="Registration Deadline, Format yyyy-mm-dd hh:mm:ss" name="registrationDeadline"></input>
        <input class="form-input" placeholder="Voting Deadline, Format yyyy-mm-dd hh:mm:ss" name="votingDeadline"></input>
        <button class="btn-form" type="submit">Create Session</button>
    </form>
</Modal>


  </div>
  

</React.Fragment>
  /*
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
    </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</React.Fragment>*/
  )
}
