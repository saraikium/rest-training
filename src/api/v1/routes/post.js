import { Router } from 'express';
import { Post } from '../../../db/models';
import JWT from '../utils/auth';
import authenticateUser from '../middlewares/authenticate';

const router = Router();

async function getAllPosts(req, resp, next) {
  try {
    const posts = await Post.findAll();
    resp.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

async function getAllPostsOfUser(req, resp, next) {
  const { userId } = req.params;
  try {
    const posts = await Post.findAll({ where: { userId } });
    resp.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

async function getPostOfUser(req, resp, next) {
  const { id } = req.params;
  try {
    let post = await Post.findOne({ where: { id } });
    if (!post) post = {};
    resp.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

async function creatPost(req, resp, next) {
  const userId = req.user.id;
  const { post } = req.body;

  try {
    const newPost = await Post.create({ ...post, userId });
    resp.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
}
