const { selectCommentById } = require("../models/model-comments");
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

module.exports = { fetchCommentsByArticleId };
