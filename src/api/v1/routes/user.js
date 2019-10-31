import { Router } from 'express';
import { User } from '../../../db/models';
import authenticateUser from '../middlewares/authenticate';
import postRouteHandlers from '../routeHelpers/post';
import commentRouteHandlers from '../routeHelpers/comment';
import autoCatch from '../errors/autoCatch';

const router = Router();
const { getPostsOfUser } = postRouteHandlers;
const { getCommentsOfPost } = commentRouteHandlers;

/* eslint-disable no-use-before-define */
router.get('/me', autoCatch([authenticateUser, getUserInfo]));
router.patch('/update', autoCatch([authenticateUser, updateUser]));
router.get('/:userId/posts', autoCatch(getPostsOfUser));
router.get('/:userId/posts/:postId/comments', autoCatch(getCommentsOfPost));
export default router;

async function updateUser(req, resp) {
  const { id } = req.user;
  const { user } = req.body;
  const updatedUser = await User.update(user, { where: { id } });
  resp.status(200).json(updatedUser);
}

function getUserInfo(req, resp) {
  const { user } = req;
  return resp.status(200).json(user);
}
