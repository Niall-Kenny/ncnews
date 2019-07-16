const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = connection => {
  const topicsInsertions = connection("topics").insert(topicData);
  const usersInsertions = connection("users").insert(userData);

  return Promise.all([topicsInsertions, usersInsertions])
    .then(() => {
      const formattedArticle = formatDates(articleData);
      return connection
        .insert(formattedArticle)
        .into("articles")
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return connection("comments").insert(formattedComments);
    });
};
