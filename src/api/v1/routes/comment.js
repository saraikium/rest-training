import { Router } from 'express';
import { Op } from 'sequelize';
import { Comment } from '../../../db/models';
import JWT from '../utils/auth';
import authenticateUser from '../middlewares/authenticate';
import { PAGINATION_LIMIT } from '../../configs';

const router = Router();

export default router;

/**
|--------------------------------------------------
| Comment Route Handlers
|--------------------------------------------------
*/
