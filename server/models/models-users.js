const connection = require("../../db/connection");

selectUser = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => user[0]);
};

module.exports = { selectUser };
