import { Op } from 'sequelize';
import { Comment } from '../../../db/models';
import { PAGINATION_LIMIT } from '../../configs';

/* eslint-disable no-use-before-define */
export default {
  createComment,
  deleteComment,
  getCommentsOfPost
};

async function createComment(req, resp, next) {
  const userId = req.user.id;
  const { comment } = req.body;
  try {
    const newComment = await Comment.create({ ...comment, userId });
    resp
      .status(200)
      .json({ message: 'Comment created successfully!', newComment });
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, resp, next) {
  const userId = req.user.id;
  const id = req.params.commentId;
  try {
    const deletedComment = await Comment.destroy({ where: { id, userId } });
    resp
      .status(200)
      .json({ message: 'Comment deleted successfully!', deletedComment });
  } catch (error) {
    next(error);
  }
}

async function getCommentsOfPost(req, resp, next) {
  const { postId } = req.params;
  let page = req.query.page || 1;
  const filter = req.query.filter || '';

  page = parseInt(page, 10);
  if (page <= 0) {
    page = 1;
  }
  const offset = (page - 1) * PAGINATION_LIMIT;

  try {
    const comments = await Comment.findAll({
      where: {
        postId,
        [Op.iLike]: `%${filter}%`
      },
      offset,
      limit: PAGINATION_LIMIT
    });
    resp.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}
