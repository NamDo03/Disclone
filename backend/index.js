import cors from 'cors';
import express from 'express';
import { router } from './routers/route.js';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({ message: 'Invalid endpoint.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Unexpected error from the server!',
  });
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  const messages = [{id: 1, name: "A", content: "hihi", timestamp: "hihi", author: {id:1, name:"hihi", avatar: "hihi"}}]
  socket.emit('previousMessages', messages);

  socket.on('newMessage', (msg) => {
    console.log('message from client:', msg);
    io.emit('message', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server is working on port 3000');
});