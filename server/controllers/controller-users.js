const { selectUser } = require("../models/models-users");

const fetchUser = (req, res, next) => {
  const { username } = req.params;

  selectUser(username)
    .then(user => {
      res.status(200).send({ user: user[0] });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { fetchUser };
