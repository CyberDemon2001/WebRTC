import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // or specify your frontend origin like "http://localhost:5173"
        methods: ['GET', 'POST']
    }
});

app.use(express.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    socket.on('join-room', data => {
        const { roomId, emailId } = data;
        console.log('User', emailId, 'joined room', roomId);
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit('joined-room', { roomId });
        socket.broadcast.to(roomId).emit('user-joined', { emailId });
    });

    socket.on('call-user', data => {
        const {emailId, offer} = data;
        const fromEmail = socketToEmailMapping.get(socket.id);
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('incoming-call', {from:fromEmail ,offer});
    });

    socket.on('call-accepted', data => {
        const {emailId, answer} = data;
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('call-accepted', { answer });
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});

io.listen(8001);