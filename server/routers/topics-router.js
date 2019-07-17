const topicsRouter = require("express").Router();
const { fetchTopics } = require("../controllers/controller-topics");
topicsRouter.get("/", fetchTopics);

module.exports = { topicsRouter };
