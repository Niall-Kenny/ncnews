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

const selectAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  if (order !== "asc" && order !== "desc")
    return Promise.reject({ status: 400, message: "invalid query" });

  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.body",
      "articles.created_at",
      "articles.votes"
    )
    .orderBy(sort_by, order)
    .count("comment_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) return query.where({ "articles.author": author });
      if (topic) return query.where({ topic });
    })
    .then(articles => {
      if (!articles.length && author)
        return Promise.reject({
          status: 404,
          message:
            "Author is not in the database or does not have any articles associated with them"
        });
      //Checking that the Topic is present in the database and that there are articles associated with them
      else if (!articles.length && topic)
        return Promise.reject({
          status: 400,
          message:
            "Topic is not in the database or does not have any articles associated with it"
        });
      else return articles;
    });
};

module.exports = {
  selectArticle,
  updateVotesOnArticle,
  insertComment,
  selectAllArticles
};
