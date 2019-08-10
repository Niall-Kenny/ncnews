const {
  getTopics,
  getThreeArticlesFromEachTopic
} = require("../models/models-topics");

const fetchTopics = (req, res, next) => {
  getTopics().then(topics => {
    res.status(200).send({ topics });
  });
};
const fetchTopicPreviews = (req, res, next) => {
  getThreeArticlesFromEachTopic().then(topicsPreview => {
    res.status(200).send({ topicsPreview });
  });
};

module.exports = { fetchTopics, fetchTopicPreviews };
