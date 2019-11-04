import { Router } from 'express';
import { Op } from 'sequelize';
import { Post, Comment } from '../../../db/models';
import authenticateUser from '../middlewares/authenticate';
import autoCatch from '../errors/autoCatch';
import configs from '../../config';
import serializers from '../serializers';
import commentRouteHandlers from '../helpers/comment';
import errorMessages from '../errors/errorMessages';
import { NotFoundError } from '../../../errors/ErrorClasses';

// @ts-check
/* eslint-disable no-use-before-define */
const { notFoundMessage } = errorMessages;
const { getCommentsOfPost } = commentRouteHandlers;
const { PAGINATION_LIMIT } = configs;
const { postSerializer } = serializers;
const router = Router();

router.get('/', autoCatch(getPosts));
router.post('/', autoCatch([authenticateUser, createPost]));
router.delete('/:postId', autoCatch([authenticateUser, deletePost]));
router.patch('/:postId', autoCatch([authenticateUser, updatePost]));
router.get('/:postId/comments', autoCatch(getCommentsOfPost));
export default router;

/**
|--------------------------------------------------
| Route Handlers
|--------------------------------------------------
*/
async function getPosts(req, resp) {
  let page = req.query.page || 1;
  const filter = req.query.filter || '';
  page = parseInt(page, 10);

  if (page <= 0) {
    page = 1;
  }
  const offset = (page - 1) * PAGINATION_LIMIT;

  const posts = await Post.findAll({
    where: {
      title: {
        [Op.iLike]: `%${filter}%`
      }
    },
    orderBy: ['id', 'ASC'],

    include: [
      {
        model: Comment,
        as: 'comments',
        required: false,
        where: {
          parentId: null
        },
        include: [
          {
            model: Comment,
            required: false,
            as: 'replies'
          }
        ]
      }
    ],
    limit: PAGINATION_LIMIT,
    offset
  });
  resp.status(200).json({ posts });
}

async function createPost(req, resp) {
  const userId = req.user.id;
  const { post } = req.body;
  const serializedPost = postSerializer(post);
  const newPost = await Post.create({ ...serializedPost, userId });
  resp.status(200).json({ post: newPost });
}

async function deletePost(req, resp) {
  const id = req.params.postId;
  const userId = req.user.id;
  const post = await Post.findOne({ where: { id, userId } });

  if (!post) {
    throw new NotFoundError(notFoundMessage('Post'));
  }
  await post.destroy();
  resp.status(200).json({ message: 'Success, post deleted.' });
}

async function updatePost(req, resp) {
  const id = req.params.postId;
  const userId = req.user.id;
  const { body, title } = req.body.post;
  const post = await Post.findOne({ where: { userId, id } });
  if (!post) {
    throw new NotFoundError(notFoundMessage('Post'));
  }
  const updatedPost = await post.update({ title, body });
  resp.status(200).json({ post: updatedPost });
}
