import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';
import commentRouteHanlders from '../lib/comment';

const { createComment, deleteComment } = commentRouteHanlders;
const router = Router();

router.post('/', [authenticateUser, createComment]);
router.delete('/:commentId', [authenticateUser, deleteComment]);

export default router;
