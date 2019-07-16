const app = require("express")();
const { fetchTopics } = require("./controllers/controller-nc_news");

app.get("/api/topics", fetchTopics);

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "404 Not Found" });
});

module.exports = app;
