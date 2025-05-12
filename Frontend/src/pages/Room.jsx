import React, { use, useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer';

const Room = () => {
  const socket = useSocket();
  const { peer, createOffer, createAnswer,setRemoteAnswer,sendStream, remoteStream } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleNewUserJoined = useCallback(async(data) => {
    const { emailId } = data;
    console.log('New user joined:', emailId);
    const offer = await createOffer();
    socket.emit('call-user', { emailId, offer });
    setRemoteEmailId(emailId);
  }, [socket, createOffer]);

    const handleIncomingCall = useCallback(async(data) => {
        const { from, offer } = data;
        console.log('Incoming call from:',from,offer);
        const answer = await createAnswer(offer);
        socket.emit('call-accepted', { emailId: from, answer });
        setRemoteEmailId(from);
    },[]);

    const handleCallAccepted = useCallback(async(data) => {
        const { answer } = data;
        await setRemoteAnswer(answer);
        console.log('Call accepted from:', answer);
    }, [setRemoteAnswer]);

   const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit('call-user', { emailId: remoteEmailId, offer });
}, [remoteEmailId, socket, peer]);



    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
     
        setMyStream(stream);
    },[sendStream]);
    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined);
        socket.on('incoming-call', handleIncomingCall);
        socket.on('call-accepted', handleCallAccepted);
        


        return () => {
            socket.off('user-joined', handleNewUserJoined);
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-accepted', handleCallAccepted);
        };
     }, [handleNewUserJoined, handleIncomingCall, socket]);


     useEffect(()=>{
         peer.addEventListener('negotiationneeded',handleNegotiationNeeded);
        return()=>{
            peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
        }
     },[handleNegotiationNeeded]);

     useEffect(() => {
        getUserMediaStream();
     }, []);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>You are connected to {remoteEmailId}</h4>
      <button onClick={(e)=>sendStream(myStream)}>Send My Video</button>
      <ReactPlayer url={myStream} playing muted/>
      <ReactPlayer url={remoteStream} playing />
    </div>
  )};

export default Room
