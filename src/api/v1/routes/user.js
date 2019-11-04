import { Router } from 'express';
import { User } from '../../../db/models';
import authenticateUser from '../middlewares/authenticate';
import postRouteHandlers from '../helpers/post';
import commentRouteHandlers from '../helpers/comment';
import autoCatch from '../errors/autoCatch';

const { getPostsOfUser } = postRouteHandlers;
const { getCommentsOfPost } = commentRouteHandlers;

/* eslint-disable no-use-before-define */
const router = Router();
router.get('/me', autoCatch([authenticateUser, getUserInfo]));
router.patch('/update', autoCatch([authenticateUser, updateUser]));
router.get('/:userId/posts', autoCatch(getPostsOfUser));
// This comment route will move to Post
router.get('/:userId/posts/:postId/comments', autoCatch(getCommentsOfPost));

export default router;

/**
|--------------------------------------------------
| User route handlers
|--------------------------------------------------
*/

async function updateUser(req, resp) {
  const { id } = req.user;
  const { user } = req.body;
  const updatedUser = await User.update(user, { where: { id } });
  resp.status(200).json(updatedUser);
}

function getUserInfo(req, resp) {
  const { user } = req;
  if (!user) {
    return resp.status(401).json({ error: 'Unauthorized!' });
  }
  return resp.status(200).json(user);
}
