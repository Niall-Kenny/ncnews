const userRouter = require("express").Router();
const { fetchUser } = require("../controllers/controller-users");
const { invalidMethod } = require("../error_handlers/errors");

userRouter
  .route("/:username")
  .get(fetchUser)
  .all(invalidMethod);

module.exports = userRouter;
