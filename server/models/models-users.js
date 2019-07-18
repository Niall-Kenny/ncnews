const connection = require("../../db/connection");

selectUser = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 404, message: "User Not Found" });
      }
      return user;
    });
};

module.exports = { selectUser };
