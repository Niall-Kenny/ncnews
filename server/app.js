const app = require("express")();
const apiRouter = require("./routers/api-router");

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "404 Not Found" });
});

module.exports = { app, apiRouter };
