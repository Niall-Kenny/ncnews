const userNotFound = (err, req, res, next) => {
  console.log("<<<inside user-Not-Found!>>>");

  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};

const psqlError = (err, req, res, next) => {
  console.log("<<<inside psql error!>>>");
  const psqlCodes = ["22P02"];
  if (psqlCodes.includes(err.code)) {
    res
      .status(400)
      .send({ message: err.message.split("-")[1] || "Bad Request" });
  } else {
    next(err);
  }
};

const routeError = (err, req, res, next) => {
  console.log("<<<inside router error!>>>");

  if (err.status === 404) {
    res.status(404).send({ message: "route not found" });
  } else {
    next(err);
  }
};

const invalidMethod = (req, res, next) => {
  console.log("<< inside invalid Method >>");
  res.status(405).send({ message: "method not allowed" });
};

module.exports = { routeError, invalidMethod, userNotFound, psqlError };
