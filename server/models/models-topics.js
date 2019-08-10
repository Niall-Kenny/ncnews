const connection = require("../../db/connection");
const { formatTopicsPreview } = require("../../db/utils/utils");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

const getThreeArticlesFromEachTopic = () => {
  return getTopics()
    .then(topics => {
      const articlePromises = topics.map(topic => {
        return connection
          .select(
            "articles.author",
            "articles.title",
            "articles.article_id",
            "articles.topic",
            "articles.created_at",
            "articles.votes"
          )
          .from("articles")
          .where("topic", `${topic.slug}`)
          .limit(3)
          .returning("*");
      });
      return Promise.all([...articlePromises, topics]);
    })
    .then(res => {
      return formatTopicsPreview(res);
    });
};

module.exports = { getTopics, getThreeArticlesFromEachTopic };
