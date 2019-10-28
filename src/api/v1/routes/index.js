// @ts-check
import { Router } from 'express';
import user from './user';

const router = Router();

router.use('/auth', user);

export default router;
