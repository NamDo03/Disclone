import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { userController } from '../controllers/UserController.js';
import { channelController } from '../controllers/ChannelController.js';
import { serverController } from '../controllers/ServerController.js';

const router = Router();

const jwtKey = process.env.JWT_KEY;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtKey,
};

passport.use(
  new Strategy(opts, async (jwtPayload, done) => {
    try {
      const user = await userController.getUserById(jwtPayload.userId);

      if (user) {
        return done(null, user);
      } else {
        return done("error", false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

router.use(passport.initialize());

router.post('/signup', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const newUser = await userController.createUser(email, username, password)
    res.status(200).json({ message: "User created", email: newUser.email });
  } catch (error) {
    return next(error);
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await userController.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user = await userController.updateLastLogin(user.id, new Date());
    const token = jwt.sign({ userId: user.id }, jwtKey, {
      expiresIn: '2h'
    });
    res.json({ 
      token, 
      user: {
        id: user.id, 
        email: user.email, 
        username: user.username, 
        avatar_url: user.avatar_url,
        last_login_at: user.last_login_at
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/server/create-channel', async (req, res, next) => {
  try {
    const {serverId, name, type } = req.body;
    if (!serverId) {
      res.status(400).json({ message: "Missing server id!"})
    }
    if (!name || !type) {
      res.status(400).json({ message: "Missing channel name or channel type!"})
    }
    const newChannel = await channelController.createChannel(serverId, name, type)
    res.status(200).json({ message: "Channel created", channel: newChannel });
  } catch (error) {
    return next(error);
  }
});

router.post('/user/create-server', async (req, res, next) => {
  try {
    const { userId, name, img_url } = req.body;
    if (!userId) {
      res.status(400).json({ message: "Missing user id of server owner!"})
    }
    if (!name || !img_url) {
      res.status(400).json({ message: "Missing server name or server banner!"})
    }
    const newServer = await serverController.createServer(userId, name, img_url)
    res.status(200).json({ message: "Server created", server: newServer });
  } catch (error) {
    return next(error);
  }
});

router.post('/server/edit', async (req, res, next) => {
  try {
    const { serverId, name, img_url, userId } = req.body;
    if (!userId || !serverId) {
      res.status(400).json({ message: "Missing user id or server id!"})
    }
    if (!name || !img_url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const updatedServer = await serverController.updateServer(serverId, userId, name, img_url ,);
    res.status(200).json({
      message: 'Server updated successfully',
      server: updatedServer
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/channel/edit', async (req, res, next) => {
  try {
    const { channelId, name, userId } = req.body;
    if (!userId || !channelId) {
      res.status(400).json({ message: "Missing user id or channel id!"})
    }
    if (!name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const updatedChannel = await channelController.updateChannel(channelId, userId, name );
    res.status(200).json({
      message: 'Channel updated successfully',
      channel: updatedChannel
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/user/:id/list-server', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const servers = await serverController.getListOfServers(userId);
    res.status(200).json({ servers });
  } catch (error) {
    return next(error);
  }
});

router.get('/server/:id/list-channel', async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const channels = await channelController.getListOfChannels(serverId);
    res.status(200).json({ channels });
  } catch (error) {
    return next(error);
  }
});

router.delete('/server/:id/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.params;
    await serverController.deleteServerById(parseInt(id));  
    res.status(200).json({ message: `Delete server suscessful` });
  } catch (error) {
    return next(error);
  }
});

router.delete('/channel/:id/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.params;   
    await channelController.deleteChannelById(parseInt(id));   
    res.status(200).json({ message: `Delete channel suscessful` });
  } catch (error) {
    return next(error);
  }
});

router.delete('/user/:id/delete', async (req, res, next) => {
  try {
    const { id } = req.params;
    await userController.deleteUserById(parseInt(id));  
    res.status(200).json({ message: `Delete user suscessful` });
  } catch (error) {
    return next(error);
  }
});

export { router };