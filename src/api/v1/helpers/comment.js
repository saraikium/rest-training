import { Op } from 'sequelize';
import { Comment } from '../../../db/models';
import config from '../../config';

/* eslint-disable no-use-before-define */
export default {
  createComment,
  deleteComment,
  getCommentsOfPost
};

const { PAGINATION_LIMIT } = config;

async function createComment(req, resp) {
  const userId = req.user.id;
  const { comment } = req.body;
  const newComment = await Comment.create({ ...comment, userId });
  resp.status(200).json({ comment: newComment });
}

async function deleteComment(req, resp) {
  const userId = req.user.id;
  const id = req.params.commentId;
  await Comment.destroy({ where: { id, userId } });
  resp.status(200).json({ message: 'Comment successfully deleted.' });
}

async function getCommentsOfPost(req, resp) {
  const { postId } = req.params;
  let page = req.query.page || 1;
  const filter = req.query.filter || '';

  page = parseInt(page, 10);
  if (page <= 0) {
    page = 1;
  }
  const offset = (page - 1) * PAGINATION_LIMIT;

  const comments = await Comment.findAll({
    where: {
      postId,
      [Op.iLike]: `%${filter}%`
    },
    order: ['id', 'ASC'],
    offset,
    limit: PAGINATION_LIMIT
  });
  resp.status(200).json({ comments });
}
