import { Router } from 'express';
import { User } from '../../../db/models';
import authenticateUser from '../middlewares/authenticate';
import postRouteHandlers from '../helpers/post';
import autoCatch from '../errors/autoCatch';
import serializers from '../serializers';
import errorMessages from '../errors/errorMessages';
import { AuthorizationError } from '../../../errors/ErrorClasses';

// @ts-check
/* eslint-disable no-use-before-define */
const { authorizationErrorMessage } = errorMessages;
const { getPostsOfUser } = postRouteHandlers;
const { userSerializer } = serializers;

const router = Router();
router.get('/me', autoCatch([authenticateUser, getUserInfo]));
router.patch('/update', autoCatch([authenticateUser, updateUser]));
router.get('/:userId/posts', autoCatch(getPostsOfUser));
export default router;

/**
|--------------------------------------------------
| User route handlers
|--------------------------------------------------
*/

async function updateUser(req, resp) {
  const { id } = req.user;
  const { user } = req.body;
  const serializedUser = userSerializer(user);
  const updatedUser = await User.update(serializedUser, { where: { id } });
  resp.status(200).json({ user: updatedUser });
}

function getUserInfo(req, resp) {
  const { user } = req;
  if (!user) {
    throw new AuthorizationError(authorizationErrorMessage());
  }
  return resp.status(200).json({ user });
}
