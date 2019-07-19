const {
  selectArticle,
  updateVotesOnArticle,
  insertComment,
  selectAllArticles
} = require("../models/model-articles");

const fetchArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const updateArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateVotesOnArticle(inc_votes, article_id)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(err => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { username, body } = req.body;

  const { article_id } = req.params;
  insertComment(username, body, article_id)
    .then(comment => {
      res.status(200).send({ comment: comment[0] });
    })
    .catch(err => {
      next(err);
    });
};

const getAllArticles = (req, res, next) => {
  selectAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  fetchArticle,
  updateArticle,
  postComment,
  getAllArticles
};
