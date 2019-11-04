import { Op } from 'sequelize';
import { Post, Comment } from '../../../db/models';
import { PAGINATION_LIMIT } from '../../config';

/* eslint-disable no-use-before-define */
export default {
  getPosts,
  getPostsOfUser,
  getPost,
  createPost,
  updatePost,
  deletePost
};

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
  resp.status(200).json(posts);
}

async function getPostsOfUser(req, resp) {
  const { userId } = req.params;
  let page = req.query.page || 1;
  const filter = req.query.filter || '';

  page = parseInt(page, 10);
  if (page <= 0) {
    page = 1;
  }
  const offset = (page - 1) * PAGINATION_LIMIT;
  const posts = await Post.findAll({
    where: {
      userId,
      title: {
        [Op.iLike]: `%${filter}%`
      }
    },
    orderBy: ['id', 'ASC'],
    limit: PAGINATION_LIMIT,
    offset,
    include: [
      {
        model: Comment,
        as: 'comments',
        where: {
          parentId: null
        },
        required: false,
        include: [
          {
            model: Comment,
            required: false,
            as: 'replies'
          }
        ]
      }
    ]
  });
  resp.status(200).json(posts);
}

async function getPost(req, resp) {
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  resp.status(200).json(post);
}

async function createPost(req, resp) {
  const userId = req.user.id;
  const { post } = req.body;
  const newPost = await Post.create({ ...post, userId });
  resp.status(200).json(newPost);
}

async function deletePost(req, resp) {
  const id = req.params.postId;
  const userId = req.user.id;

  const post = await Post.findOne({ where: { id, userId } });

  if (!post) {
    return resp.status(404).json({ error: 'Post not found' });
  }
  // Check returning true
  const deletedPost = await post.destroy({ returning: true });
  console.log('Deleted', deletedPost);
  // Deletd resource should not be sent back.
  resp.status(200).json({ message: 'Success, post deleted.', deletedPost });
}

async function updatePost(req, resp) {
  const id = req.params.postId;
  const userId = req.user.id;
  const { body, title } = req.body.post;
  const post = await Post.findOne({ where: { userId, id } });
  if (!post) {
    return resp.status(400).json({ error: 'Post not found!' });
  }
  const updatedPost = await post.update({ title, body });
  // Use key {post: updatedPost}
  resp.status(200).json(updatedPost);
}
