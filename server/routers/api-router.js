const { topicsRouter } = require("./topics-router");
const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const articleRouter = require("./article-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);

module.exports = apiRouter;
