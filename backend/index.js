import cors from 'cors';
import express from 'express';
import { router } from './routers/route.js';
import { createServer } from 'http';
import { Server } from "socket.io";
import ChatManager from './io/ChatManager.js';
import DirectMessageManager from './io/DirectMessageManager.js';

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

const chatManager = new ChatManager(io);
chatManager.setupSocketEvents();

const directMessageManager = new DirectMessageManager(io);
directMessageManager.setupSocketEvents();

server.listen(3000, () => {
  console.log('server is working on port 3000');
});