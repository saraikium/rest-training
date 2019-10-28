import { Router } from 'express';
import { User } from '../../../db/models';
import JWT from '../utils/auth';
import authenticateUser from '../middlewares/authenticate';
// @ts-check

const router = Router();
const { newToken } = JWT;

/* eslint-disable no-use-before-define */
router.get('/me', [authenticateUser, getUserInfo]);
router.post('/signup', register);
router.post('/signin', login);
router.patch('/update', [authenticateUser, updateUser]);

export default router;

/**
|--------------------------------------------------
| Route Handlers
|--------------------------------------------------
*/

async function register(req, resp, next) {
  const { user } = req.body;
  try {
    const newUser = await User.create(user);
    const token = newToken({ id: newUser.id });
    resp.status(201).json({ token });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, resp, next) {
  const { id } = req.user;
  const { user } = req.body;
  try {
    const updatedUser = User.update(user, { where: { id } });
    resp.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

function getUserInfo(req, resp, next) {
  const { user } = req;
  resp.status(200).json(user);
}

async function login(req, resp, next) {
  const { email, password } = req.body.user;
  try {
    const user = await User.findOne({
      attributes: { exclude: ['passwordHash'] },
      where: { email }
    });
    const authenticated = await user.authenticate(password);
    if (!authenticated) {
      resp.status(401).json({ message: 'Unauthorized.' });
    }
    const token = newToken({ id: user.id });
    resp.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}
