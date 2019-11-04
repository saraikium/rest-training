import { Router } from 'express';
import { User } from '../../../db/models';
import JWT from '../utils/auth';
import autoCatch from '../errors/autoCatch';
import serializers from '../serializers';
import authenticateUser from '../middlewares/authenticate';
import errorMessages from '../errors/errorMessages';
import {
  AuthenticationError,
  NotFoundError
} from '../../../errors/ErrorClasses';

const { userSerializer } = serializers;
const { newToken, verifyToken, newRefreshToken } = JWT;
const { notFoundMessage, authenticationErrorMessage } = errorMessages;

/* eslint-disable no-use-before-define */
const router = Router();
router.post('/signup', autoCatch(signup));
router.post('/signin', autoCatch(signin));
router.post('/refresh-token', autoCatch([authenticateUser, getNewToken]));
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

  if (!user) throw new NotFoundError(notFoundMessage('User'));

  const authenticated = await user.authenticate(password);

  if (!authenticated)
    throw new AuthenticationError(authenticationErrorMessage());

  const token = newToken({ id: user.id });
  const refreshToken = newRefreshToken({ id: user.id });
  resp.status(200).json({ token, refreshToken });
}

async function signup(req, resp) {
  const { user } = req.body;
  const serializedUser = userSerializer(user);
  const newUser = await User.create(serializedUser);
  const token = newToken({ id: newUser.id });
  const refreshToken = newRefreshToken({ id: newUser.id });
  resp.status(201).json({ token, refreshToken });
}

async function getNewToken(req, resp, next) {
  const oldToken = req.body.refreshToken;

  if (!oldToken) throw new AuthenticationError(authenticationErrorMessage());

  const payload = await verifyToken(oldToken);
  const newAccessToken = newToken({ id: payload.id });
  const refreshToken = newRefreshToken({ id: payload.id });
  resp.status(200).json({ token: newAccessToken, refreshToken });
}
