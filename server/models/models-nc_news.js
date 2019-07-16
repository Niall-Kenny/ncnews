const connection = require("../../db/connection");
const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

module.exports = { getTopics };
