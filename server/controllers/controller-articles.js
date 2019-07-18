const {
  selectArticle,
  updateVotesOnArticle
} = require("../models/model-articles");

const fetchArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then(article => {
      if (!article.length) {
        next({ status: 404, message: "article_id not found" });
      } else res.status(200).send({ article: article[0] });
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
      if (!article.length) {
        next({ status: 404, message: "article_id not found" });
      } else res.status(200).send({ article: article[0] });
    })
    .catch(err => {
      next(err);
    });
};
module.exports = { fetchArticle, updateArticle };
