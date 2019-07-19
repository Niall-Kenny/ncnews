const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  routeError,
  customError,
  psqlError
} = require("./error_handlers/errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(customError);
app.use(psqlError);
app.use(routeError);

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "404 Not Found" });
});

module.exports = { app, apiRouter };
