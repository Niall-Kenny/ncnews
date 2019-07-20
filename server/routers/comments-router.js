const commentRouter = require("express").Router();
const {
  updateComment,
  removeComment
} = require("../controllers/controller-comments");
const { invalidMethod } = require("../error_handlers/errors");

commentRouter
  .route("/:comment_id")
  .patch(updateComment)
  .delete(removeComment)
  .all(invalidMethod);

module.exports = commentRouter;
