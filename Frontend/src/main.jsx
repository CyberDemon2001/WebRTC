import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import { SocketProvider } from './providers/Socket.jsx';
import { PeerProvider } from './providers/Peer.jsx';
import Room from './pages/Room.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <SocketProvider>
      <PeerProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
      </PeerProvider>
    </SocketProvider>
  </BrowserRouter>
);
