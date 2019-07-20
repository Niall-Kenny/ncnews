const articleRouter = require("express").Router();
const {
  fetchArticle,
  updateArticle,
  postComment,
  getAllArticles
} = require("../controllers/controller-articles");
const {
  fetchCommentsByArticleId
} = require("../controllers/controller-comments");
const { invalidMethod } = require("../error_handlers/errors");

articleRouter
  .route("/")
  .get(getAllArticles)
  .all(invalidMethod);

articleRouter
  .route("/:article_id")
  .get(fetchArticle)
  .patch(updateArticle)
  .all(invalidMethod);

articleRouter
  .route("/:article_id/comments")
  .get(fetchCommentsByArticleId)
  .post(postComment)
  .all(invalidMethod);

module.exports = articleRouter;
