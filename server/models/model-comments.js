const connection = require("../../db/connection");

const selectCommentById = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by, order)
    .then(comments => {
      return Promise.all([checkIdExists(article_id), comments]);
    })
    .then(([bool, comments]) => {
      if (!bool) {
        return Promise.reject({
          status: 404,
          message: "article id doesn't exist"
        });
      } else return comments;
    });
};
const checkIdExists = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(article => {
      return article.length >= 1 ? true : false;
    });
};

module.exports = { selectCommentById };
