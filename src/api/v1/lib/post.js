import { Op } from 'sequelize';
import { Post } from '../../../db/models';
import { PAGINATION_LIMIT } from '../../configs';

/* eslint-disable no-use-before-define */

export default {
  getAllPosts,
  getAllPostsOfUser,
  getPost,
  createPost,
  updatePost,
  deletePost
};

async function getAllPosts(req, resp, next) {
  let page = req.query.page || 1;
  const filter = req.query.filter || '';
  page = parseInt(page, 10);
  if (page <= 0) {
    page = 1;
  }
  const offset = (page - 1) * PAGINATION_LIMIT;
  try {
    const posts = await Post.findAll({
      where: {
        title: {
          [Op.iLike]: `%${filter}%`
        }
      },
      limit: PAGINATION_LIMIT,
      offset
    });
    resp.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

async function getAllPostsOfUser(req, resp, next) {
  const { userId } = req.params;
  let page = req.query.page || 1;
  const filter = req.query.filter || '';

  page = parseInt(page, 10);
  if (page <= 0) {
    page = 1;
  }
  const offset = (page - 1) * PAGINATION_LIMIT;
  try {
    const posts = await Post.findAll({
      where: {
        userId,
        title: {
          [Op.iLike]: `%${filter}%`
        }
      },
      limit: PAGINATION_LIMIT,
      offset
    });
    resp.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

async function getPost(req, resp, next) {
  const { id } = req.params;
  try {
    let post = await Post.findOne({ where: { id } });
    if (!post) post = {};
    resp.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

async function createPost(req, resp, next) {
  const userId = req.user.id;
  const { post } = req.body;

  try {
    const newPost = await Post.create({ ...post, userId });
    resp.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, resp, next) {
  const id = req.params.postId;
  const userId = req.user.id;

  try {
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      resp.status(404).json({ error: 'Post not found' });
    }
    const deletedPost = await post.destroy();
    resp.status(200).json({ message: 'Success, post deleted.', deletedPost });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, resp, next) {
  const id = req.params.postId;
  const userId = req.user.id;
  const { body, title } = req.body.post;

  try {
    const updatedPost = Post.update({ title, body }, { where: { userId, id } });
    resp.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
}
