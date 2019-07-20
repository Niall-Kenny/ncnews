const commentRouter = require("express").Router();
const { updateComment } = require("../controllers/controller-comments");
const { invalidMethod } = require("../error_handlers/errors");

commentRouter
  .route("/:comment_id")
  .patch(updateComment)
  .all(invalidMethod);

module.exports = commentRouter;
