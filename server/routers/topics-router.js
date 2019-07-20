const topicsRouter = require("express").Router();
const { fetchTopics } = require("../controllers/controller-topics");
const { invalidMethod } = require("../error_handlers/errors");

topicsRouter
  .route("/")
  .get(fetchTopics)
  .all(invalidMethod);

module.exports = { topicsRouter };
