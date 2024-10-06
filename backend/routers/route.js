import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { userController } from '../controllers/UserController.js';
import { chanelController } from '../controllers/ChanelController.js';
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

router.get('/hello', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    res.status(200).json({ message: "hello" });
  } catch (error) {
    return next(error);
  }
});

router.post('/server/create-channel', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { userId, name, type } = req.body;
    const newChanel = await chanelController.createChanel(userId, name, type)
    res.status(200).json({ message: "Chanel created", chanel: newChanel });
  } catch (error) {
    return next(error);
  }
});

router.post('/user/create-server', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { userId, name, img_url } = req.body;
    const newServer = await serverController.createServer(userId, name, img_url)
    res.status(200).json({ message: "Server created", server: newServer });
  } catch (error) {
    return next(error);
  }
});

router.post('/server/edit', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { serverId,name, img_url, userId } = req.body;
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

router.post('/channel/edit', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { channelId, name, userId } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const updatedChannel = await chanelController.updateChannel(channelId, userId, name );
    res.status(200).json({
      message: 'Channel updated successfully',
      chanel: updatedChannel
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/server/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.body;
    await serverController.deleteServerById(id);  
    res.status(200).json({ message: `Delete suscessful` });
  } catch (error) {
    return next(error);
  }
});

router.delete('/channel/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.body;   
    await chanelController.deleteChannelById(id);   
    res.status(200).json({ message: `Delete suscessful` });
  } catch (error) {
    return next(error);
  }
});

router.delete('/user/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.body;
    await userController.deleteUserById(id);  
    res.status(200).json({ message: `Delete suscessful` });
  } catch (error) {
    return next(error);
  }
});
export { router };