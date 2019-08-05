const customError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

const psqlError = (err, req, res, next) => {
  const psqlCodes = {
    "22P02": { status: 400, message: err.message.split("-")[1] },
    "23503": { status: 404, message: "Article does not exist" },
    "42703": { status: 400, message: err.message.split("-")[1] },
    "23502": { status: 400, message: "invalid input" }
  };
  if (psqlCodes[err.code]) {
    res
      .status(psqlCodes[err.code].status)
      .send({ message: psqlCodes[err.code].message });
  } else {
    next(err);
  }
};

const routeError = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: "route not found" });
  } else {
    next(err);
  }
};

const invalidMethod = (req, res, next) => {
  res.status(405).send({ message: "method not allowed" });
};

module.exports = { routeError, invalidMethod, customError, psqlError };
