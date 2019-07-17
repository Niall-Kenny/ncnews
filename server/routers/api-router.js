const { topicsRouter } = require("./topics-router");
const apiRouter = require("express").Router();
const userRouter = require("./users-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
