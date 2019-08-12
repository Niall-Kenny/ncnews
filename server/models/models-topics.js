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
          .where({ topic: topic.slug })
          .count("comment_id as comment_count")
          .leftJoin("comments", "articles.article_id", "comments.article_id")
          .groupBy("articles.article_id")
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
