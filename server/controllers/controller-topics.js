const { getTopics } = require("../models/models-topics");
const fetchTopics = (req, res, next) => {
  getTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

module.exports = { fetchTopics };
