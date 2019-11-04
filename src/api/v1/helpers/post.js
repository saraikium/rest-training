import { Op } from 'sequelize';
import { Post, Comment } from '../../../db/models';
import configs from '../../config';

// @ts-check
/* eslint-disable no-use-before-define */

export default {
  getPostsOfUser,
  getPost
};

const { PAGINATION_LIMIT } = configs;

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
  resp.status(200).json({ posts });
}

async function getPost(req, resp) {
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  resp.status(200).json({ post });
}
