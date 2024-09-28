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

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await userController.createUser(username, password)
    res.status(200).json({ message: "User created", username: newUser.username });
  } catch (error) {
    return next(error);
  }
});


router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userController.getUserByName(username);
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, jwtKey, {
      expiresIn: '2h'
    });
    res.json({ token });
  } catch (error) {
    return next(error);
  }
});

router.get('/hello', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

export { router };