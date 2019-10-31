import { Router } from 'express';
import { User } from '../../../db/models';
import JWT from '../utils/auth';
import autoCatch from '../errors/autoCatch';

const { newToken } = JWT;
const router = Router();

/* eslint-disable no-use-before-define */
router.post('/signup', autoCatch(signup));
router.post('/signin', autoCatch(signin));

export default router;

/**
|--------------------------------------------------
| Auth route handlers
|--------------------------------------------------
*/

async function signin(req, resp) {
  const { email, password } = req.body.user;
  const user = await User.findOne({
    where: { email }
  });
  if (!user) {
    return resp.status(404).json({ error: 'Not found.' });
  }
  const authenticated = await user.authenticate(password);
  if (!authenticated) {
    return resp.status(401).json({ message: 'Unauthorized.' });
  }
  const token = newToken({ id: user.id });
  resp.status(200).json({ token });
}

async function signup(req, resp) {
  const { user } = req.body;
  const newUser = await User.create(user);
  const token = newToken({ id: newUser.id });
  resp.status(201).json({ token });
}
