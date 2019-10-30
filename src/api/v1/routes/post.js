import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';
import postRouteHandlers from '../lib/post';

const { getPost, deletePost, createPost, updatePost } = postRouteHandlers;
const router = Router();

router.get('/', getPost);
router.post('/', [authenticateUser, createPost]);
router.delete('/:postId', [authenticateUser, deletePost]);
router.patch('/:postId', [authenticateUser, updatePost]);

export default router;
