import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';
import postRouteHandlers from '../routeHelpers/post';
import autoCatch from '../errors/autoCatch';

const { getPosts, deletePost, createPost, updatePost } = postRouteHandlers;
const router = Router();

router.get('/', autoCatch(getPosts));
router.post('/', autoCatch([authenticateUser, createPost]));
router.delete('/:postId', autoCatch([authenticateUser, deletePost]));
router.patch('/:postId', autoCatch([authenticateUser, updatePost]));

export default router;
