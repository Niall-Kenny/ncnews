const { topicsRouter } = require("./topics-router");
const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comments-router");
const { invalidMethod } = require("../error_handlers/errors");

apiRouter.route("/").all(invalidMethod);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
