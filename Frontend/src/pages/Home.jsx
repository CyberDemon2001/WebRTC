import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket'
import { React,useState,useEffect, useCallback } from 'react';

const Home = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();
  
  const handleRoomJoined=useCallback(({roomId})=>{
    console.log('You have joined the room:', roomId);
    navigate(`/room/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    socket.on('joined-room', handleRoomJoined);

    return () => {
      socket.off('joined-room', handleRoomJoined);
    }
  }, [handleRoomJoined, socket]);


  const handleJoinRoom = () => {
    socket.emit('join-room', {emailId: email, roomId});
  };

  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col items-center justify-center border-2 rounded-lg shadow-lg p-4 '>
            <h1 className='text-4xl font-bold mb-4'>Welcome to the Chat Room</h1>
            <input className='border border-gray-300 mb-2 p-2 rounded text-2xl' value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder='Enter your Email here' />
            <input className='border border-gray-300 mb-2 p-2 rounded text-2xl' value={roomId} onChange={e=>setRoomId(e.target.value)} type="text" placeholder='Enter Room Code' />
            <button className='bg-blue-500 text-white mb-2 p-2 rounded text-2xl cursor-pointer' onClick={handleJoinRoom}>Enter Room</button>
        </div>
      </div>

    </div>
  )
}

export default Home
