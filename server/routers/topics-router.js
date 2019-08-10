const topicsRouter = require("express").Router();
const {
  fetchTopics,
  fetchTopicPreviews
} = require("../controllers/controller-topics");
const { invalidMethod } = require("../error_handlers/errors");

topicsRouter
  .route("/")
  .get(fetchTopics)
  .all(invalidMethod);
topicsRouter
  .route("/preview")
  .get(fetchTopicPreviews)
  .all(invalidMethod);

module.exports = { topicsRouter };
