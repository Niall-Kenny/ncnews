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

const updateCommentVotes = (inc_votes = 0, comment_id) => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({
          status: 404,
          message: `comment id: ${comment_id} does not exist`
        });
      } else return comment[0];
    });
};

module.exports = { selectCommentById, updateCommentVotes };
