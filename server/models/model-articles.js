const connection = require("../../db/connection");

const selectArticle = article_id => {
  return connection
    .select(
      "articles.author",
      "articles.body",
      "articles.article_id",
      "articles.created_at",
      "title",
      "topic",
      "articles.votes"
    )
    .from("articles")
    .where("articles.article_id", article_id)
    .join("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comment_id as comment_count")
    .then(article => article[0]);
};

const updateVotesOnArticle = (inc_votes = 0, article_id) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => article[0]);
};

module.exports = { selectArticle, updateVotesOnArticle };
