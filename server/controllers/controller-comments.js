const {
  selectCommentById,
  updateCommentVotes
} = require("../models/model-comments");

const fetchCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentById(article_id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const updateComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined)
    next({ status: 400, message: "invalid request" });

  updateCommentVotes(inc_votes, comment_id)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { fetchCommentsByArticleId, updateComment };
