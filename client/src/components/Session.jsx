import React, { Component, useEffect, useState } from 'react';
import "../styles/session.css";
import { Drawer } from '@mantine/core';
import Participants from './Participants';
import { showNotification } from '@mantine/notifications';
export default function Session({session,myAddr,instance}) {

// checks whether user has been approved by admin or not  
async function checkRegisteredStatus(addr)
{
  let result = await instance.methods.isRegistered(session.id,addr).call();
  return result;
}

const [sessionPhase, setSessionPhase] = useState("")
const [registered, setRegistered] = useState(null);
const [requested, setRequested] = useState(null);
const [owner, setOwner] = useState(false);
const [adminClassParams, setAdminClassParams] = useState("invisible");
const [sessionPhaseClassParams, setsessionPhaseClassParams] = useState("");
const [joinVoterClassParams, setJoinVoterClassParams] = useState("");
const [joinCandidateClassParams, setjoinCandidateClassParams] = useState("");
const [openedDrawer, setOpenedDrawer] = useState(false);
const [voted, setVoted] = useState(false);

useEffect(()=>
{
  switch (requested) {
    case true:
        setJoinVoterClassParams("invisible");
        setjoinCandidateClassParams("invisible");
      break;
    case false:
      {
        setJoinVoterClassParams("btn-form-voter");
        setjoinCandidateClassParams("btn-form-candidate");
      }
      break;
    default:
      break;
  }
  switch (sessionPhase)
  {
    case "Registration":
      setSessionPhase("registration");
      setsessionPhaseClassParams("registration")
    break;
    case "Voting":
      setJoinVoterClassParams("invisible");
      setjoinCandidateClassParams("invisible");
      setsessionPhaseClassParams("voting");
    break;
    case "Locked":
      // count the votes and display winner
      setJoinVoterClassParams("invisible");
      setjoinCandidateClassParams("invisible");
      setsessionPhaseClassParams("locked");
    break;  
  }
},[sessionPhase,requested])

const checkRequestStatus = async (addr)=>
{
  let result = await instance.methods.requested(session.id,addr).call();
  return result;
}
useEffect(()=>
{

    const checkVoted = async ()=>
    {
      let result = await instance.methods.voted(session.id,myAddr).call();
      setVoted(result);
    }
    checkVoted();
  
  verifyOwnership();
  const requestStatus = async ()=>
  {
    let result = await checkRequestStatus(myAddr);
    setRequested(result);
  }
  requestStatus();
},[myAddr])


const verifyOwnership= ()=>
{
  if(parseInt(myAddr) === parseInt(session.owner))
  {
    setOwner(true);
    setRequested(true);
    setAdminClassParams("admin-badge");
    return true;
  }else
  {
    setAdminClassParams("invisible")
    return false;
  }
}

useEffect(()=>
{
  if(verifyOwnership())
  {
    setOwner(true);
    setRequested(true);
  }
  instance.events.voterApproved({fromBlock:0,filter:{sessionID:session.id,voter:myAddr}}).on("data",async (evt)=>
    {
      let result = await checkRegisteredStatus(myAddr);
      if (evt.returnValues.voter === myAddr)
      {
          setRegistered(result.status);
      }
    });
    //get current unix epoch time and compare it with deadline and set handler
    let currentUnixTime = Math.floor((Date.now()/1000));
    if (parseInt(session.votingDeadline) > parseInt(currentUnixTime))
    {
      if (parseInt(session.registrationDeadline) > parseInt(currentUnixTime))
      {
          setSessionPhase("Registration");
          let timeLeft =parseInt(session.registrationDeadline) - currentUnixTime;
          setTimeout(()=>
          {
            console.log("voting phase Reached");
            setSessionPhase("Voting");
            setTimeout(()=>{
              console.log("voting phase Ended, Count the votes");
              setSessionPhase('Locked');
            },(parseInt(session.votingDeadline) - parseInt(session.registrationDeadline))*1000);     
          },timeLeft *1000)
      }else
      {
        let timeLeft = parseInt(session.votingDeadline) - currentUnixTime;
        setSessionPhase("Voting");
        setTimeout(()=>
        {
            console.log("voting phase Ended, Count the votes");
            setSessionPhase('Locked');
        },timeLeft*1000);
      }
    }else
    {
      console.log("session Finished");
      setSessionPhase("Locked")
    }
},[]);

const joinSessionAsCandidate = async()=>
{
    await instance.methods.registerCandidate(session.id).send({from:myAddr});
    showNotification(
      {
        title:"Dvote",
        message:"Join as Candidate Request sent succefully",
        color:"green"
      })
    setRequested(true);
}

const joinSessionAsVoter = async ()=>
{
  await instance.methods.registerVoter(session.id).send({from:myAddr});
  showNotification(
      {
        title:"Dvote",
        message:"Join as voter Request sent succefully",
        color:"green",
      })
    setRequested(true);
  setRequested(true);
}

const showParticipants = async ()=>
{
  setOpenedDrawer(true);
}

    return (
      <div class="card">
          <div class="card-header">
          </div>
          <div class="card-title">
            <p class="title">Session#{session.id}</p>
            <div class={adminClassParams}>
              <p >Admin</p>
            </div>
            <div class="registration-badge">
              <button class={sessionPhaseClassParams}>{sessionPhase}</button>
            </div>
          </div>
          <p class="card-description">{session.info}</p>
          <div class="voting-info-items">
            <button class={joinVoterClassParams} onClick={joinSessionAsVoter}>Join as Voter</button>
            <button class={joinCandidateClassParams} onClick={joinSessionAsCandidate}>Join as candidate</button>
            <button class="btn-form-participants" onClick={showParticipants}>Participants</button>
          </div>

          <Drawer
              opened={openedDrawer}
              onClose={() => setOpenedDrawer(false)}
              title=""
              position ="bottom"
              transition="rotate-left"
              transitionDuration={200}
              transitionTimingFunction="ease"
              size="80%"
            >
              <Participants instance={instance} registered={registered} owner={owner} myAddr={myAddr}
                session={session} sessionPhase={sessionPhase} checkRegisteredStatus={checkRegisteredStatus}
                votedState={[voted,setVoted]}/>
              </Drawer>
      </div>

      /*
      <div class="row border" style={{height:"400px"}}>
            <div class="col-4 border card">
              <div class="card-body">
                <p class="card-title p-2 w-100">Session#{session.id}</p>
                <p class="card-text p-2 w-100">{session.info}</p>
            </div>
                <ul class="list-group">
                    <span class="list-group-item">Candidates size:{session.maxCandidateSize}</span>
                    <li class="list-group-item">voters size:{session.maxVotersSize}</li>
                    <li class="list-group-item">{sessionPhase} Phase</li>
                    <li class={winnerClassParams}>Winning Candidate:{winner}</li>
                </ul>
            <div class="card-body">
              <div class={joinVoterClassParams} onClick={joinSessionAsVoter}>Register as voter</div>
              <div class={joinCandidateClassParams} onClick={joinSessionAsCandidate}>Register as candidate</div>
            </div>  
            </div>
            <div class="col border h-100">
              <div class="row"  style={{height:"400px"}}>
              {participantList}
              </div>
            </div>
      </div> */
      );
}
