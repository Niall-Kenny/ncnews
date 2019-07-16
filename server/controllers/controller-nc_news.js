const { getTopics } = require("../models/models-nc_news");
const fetchTopics = (req, res, next) => {
  getTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

module.exports = { fetchTopics };
