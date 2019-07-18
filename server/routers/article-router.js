const articleRouter = require("express").Router();
const {
  fetchArticle,
  updateArticle
} = require("../controllers/controller-articles");
const { invalidMethod } = require("../error_handlers/errors");

articleRouter
  .route("/:article_id")
  .get(fetchArticle)
  .patch(updateArticle)
  .all(invalidMethod);

module.exports = articleRouter;
