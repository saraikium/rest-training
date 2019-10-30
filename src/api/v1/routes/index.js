// @ts-check
import { Router } from 'express';
import user from './user';
import post from './post';
import comment from './comment';

const router = Router();

router.use('/users', user);
router.use('/posts', post);
router.use('/comments', comment);
export default router;
