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

router.post('/server/create-channel', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { serverId, name, type } = req.body;
    if (!serverId) {
      res.status(400).json({ message: "Missing server id!" })
    }
    if (!name || !type) {
      res.status(400).json({ message: "Missing channel name or channel type!" })
    }
    const newChannel = await channelController.createChannel(serverId, name, type)
    res.status(200).json({ message: "Channel created", channel: newChannel });
  } catch (error) {
    return next(error);
  }
});

router.post('/user/create-server', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { userId, name, img_url } = req.body;
    if (!userId) {
      res.status(400).json({ message: "Missing user id of server owner!" })
    }
    if (!name || !img_url) {
      res.status(400).json({ message: "Missing server name or server banner!" })
    }
    const newServer = await serverController.createServer(userId, name, img_url)
    res.status(200).json({ message: "Server created", server: newServer });
  } catch (error) {
    return next(error);
  }
});

router.post('/server/edit', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { serverId, name, img_url, userId } = req.body;
    if (!userId || !serverId) {
      res.status(400).json({ message: "Missing user id or server id!" })
    }
    if (!name || !img_url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const updatedServer = await serverController.updateServer(serverId, userId, name, img_url,);
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
    if (!userId || !channelId) {
      res.status(400).json({ message: "Missing user id or channel id!" })
    }
    if (!name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const updatedChannel = await channelController.updateChannel(channelId, userId, name);
    res.status(200).json({
      message: 'Channel updated successfully',
      channel: updatedChannel
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/user/:userId/list-server', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const servers = await serverController.getListOfServers(userId);
    res.status(200).json({ servers });
  } catch (error) {
    return next(error);
  }
});

router.get('/server/:serverId/list-channel', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
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

router.delete('/user/:id/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.params;
    await userController.deleteUserById(parseInt(id));
    res.status(200).json({ message: `Delete user suscessful` });
  } catch (error) {
    return next(error);
  }
});

router.get('/server/:serverId/list-member', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const members = await serverController.getListOfMembers(serverId);
    res.status(200).json({ members });
  } catch (error) {
    return next(error);
  }
});

router.delete('/server/delete-member', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { serverId, userId } = req.body;

    if (!serverId || !userId) {
      return res.status(400).json({ message: "Missing server id or user id!" });
    }

    const result = await serverController.deleteMember(serverId, userId);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});


router.get('/server/:serverId/get-by-id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverController.getServerById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    res.status(200).json(
      server
    );
  } catch (error) {
    return next(error);
  }
});

router.get('/channel/:channelId/get-by-id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = await channelController.getChannelById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    res.status(200).json(channel);

  } catch (error) {
    return next(error);
  }
});

router.post('/server/join', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { serverId, userId } = req.body;

    const newMember = await serverController.addMemberToServer(serverId, userId);
    res.status(201).json({ message: 'User added to server successfully!', member: newMember });
  } catch (error) {
    return next(error);
  }
});

router.get('/user/:userId/get-by-id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userController.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});
router.post('/user/update-username', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { newUsername, currentPassword, userId } = req.body;

    if (!userId || !newUsername || !currentPassword) {
      return res.status(400).json({ message: "Both new username and current password are required!" });
    }

    const updatedUser = await userController.updateUsername(userId, newUsername, currentPassword);
    res.status(200).json({ message: 'Username updated successfully', user: updatedUser });
  } catch (error) {
    return next(error);
  }
});


router.post('/user/update-password', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { currentPassword, newPassword, userId } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required!" });
    }

    const user = await userController.getUserById(parseInt(userId));
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userController.updatePassword(userId, hashedPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
});

router.post('/user/update-avatar', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { avatarUrl, userId } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: "Avatar URL is required!" });
    }

    const updatedUser = await userController.updateAvatar(userId, avatarUrl);
    res.status(200).json({ message: "Avatar updated successfully", user: updatedUser });
  } catch (error) {
    return next(error);
  }
});

router.delete('/user/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    await userController.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return next(error);
  }
});



router.post('/user/add-friend', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { friendUsername, userId } = req.body;
    if (!userId || !friendUsername) {
      return res.status(400).json({ message: "Missing user id or friend's username!" });
    }

    const result = await userController.sendFriendInvite(userId, friendUsername);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/user/accept-friend', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { inviteId } = req.body;
    if (!inviteId) {
      return res.status(400).json({ message: "Missing invite ID!" });
    }

    const result = await userController.acceptFriendInvite(inviteId);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/user/reject-friend', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { inviteId } = req.body;
    if (!inviteId) {
      return res.status(400).json({ message: "Missing invite ID!" });
    }

    const result = await userController.rejectFriendInvite(inviteId);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get('/user/pending-invites', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const userId = req.user.id; 

    const pendingInvites = await userController.getPendingInvites(userId);

    res.status(200).json(pendingInvites);

  } catch (error) {
    return next(error);
  }
});
router.get('/user/:id/friends', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id); 
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid userId provided' });
    }

    const friends = await userController.getFriends(userId);

    res.status(200).json(friends);
  } catch (error) {
    return next(error);
  }
});

router.delete('/user/remove-friend', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required!" });
    }

    await userController.removeFriend(userId, friendId);
    res.status(200).json({ message: "Friendship deleted successfully" });
  } catch (error) {
    return next(error);
  }
});

router.get('/user/:id/direct-messages', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'user ID not found' });
    }

    const directMessages = await userController.getDirectMessagesForUser(userId)
    res.status(200).json(directMessages);
  } catch (error) {
    return next(error);
  }
});


router.get('/user/direct-messages/get-by-id/:directMessageID', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const directMessageID = parseInt(req.params.directMessageID);

    if (isNaN(directMessageID)) {
      return res.status(400).json({ message: 'Invalid direct message ID' });
    }

    const directMessage = await userController.getDirectMessageById(directMessageID);
    
    if (!directMessage) {
      return res.status(404).json({ message: 'Direct message not found' });
    }

    res.status(200).json(directMessage);
  } catch (error) {
    return next(error);
  }
});

router.delete('/message/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { messageId } = req.body;
    const userId = req.user.id;

    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required!" });
    }

 
    await userController.deleteMessage(userId, messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return next(error);
  }
});

router.put('/message/update', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { messageId, content, iv } = req.body;
    const userId = req.user.id;

    if (!messageId || !content) {
      return res.status(400).json({ message: "Message ID and new content are required!" });
    }

    await userController.updateMessage(userId, messageId, content, iv);

    res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    return next(error);
  }
});

router.get('/user/get-directmsg-id/:friendId/:userId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { friendId, userId } = req.params;

    if (!friendId || !userId || isNaN(parseInt(friendId)) || isNaN(parseInt(userId))) {
      return res.status(400).json({ message: 'Invalid friendId or userId' });
    }

    const directmsgId = await userController.getDirectmsgId(parseInt(friendId), parseInt(userId))

    if (!directmsgId) {
      return res.status(404).json({ message: 'Direct message not found' });
    }
    res.status(200).json({ id: directmsgId });
  } catch (error) {
    return next(error);
  }
});



export { router };