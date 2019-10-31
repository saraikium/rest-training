import { Op } from 'sequelize';
import { Comment } from '../../../db/models';
import { PAGINATION_LIMIT } from '../../configs';

/* eslint-disable no-use-before-define */
export default {
  createComment,
  deleteComment,
  getCommentsOfPost
};

async function createComment(req, resp) {
  const userId = req.user.id;
  const { comment } = req.body;
  const newComment = await Comment.create({ ...comment, userId });
  resp
    .status(200)
    .json({ message: 'Comment created successfully!', newComment });
}

async function deleteComment(req, resp) {
  const userId = req.user.id;
  const id = req.params.commentId;
  const deletedComment = await Comment.destroy({ where: { id, userId } });
  resp
    .status(200)
    .json({ message: 'Comment deleted successfully!', deletedComment });
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
  resp.status(200).json(comments);
}
