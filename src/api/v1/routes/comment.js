import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';
import commentRouteHanlders from '../helpers/comment';
import autoCatch from '../errors/autoCatch';

const { createComment, deleteComment } = commentRouteHanlders;

const router = Router();
router.post('/', autoCatch([authenticateUser, createComment]));
router.delete('/:commentId', autoCatch([authenticateUser, deleteComment]));
export default router;
