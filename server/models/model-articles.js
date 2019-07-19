const connection = require("../../db/connection");

const selectArticle = article_id => {
  return connection("articles")
    .select("articles.*")
    .count("comment_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then(rows => {
      console.log(rows);
      if (!rows.length)
        return Promise.reject({ status: 404, message: "article not found" });
      else {
        return rows[0];
      }
    });
};

const updateVotesOnArticle = (inc_votes = 0, article_id) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          message: "article doesn't exist"
        });
      } else return article;
    });
};

const insertComment = (username, body, article_id) => {
  return connection("comments")
    .insert({ article_id: article_id, author: username, body: body })
    .returning("*");
};

module.exports = {
  selectArticle,
  updateVotesOnArticle,
  insertComment
};
