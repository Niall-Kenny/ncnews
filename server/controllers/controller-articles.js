const {
  selectArticle,
  updateVotesOnArticle
} = require("../models/model-articles");

const fetchArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const updateArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateVotesOnArticle(inc_votes, article_id).then(article => {
    res.status(200).send({ article });
  });
};
module.exports = { fetchArticle, updateArticle };
