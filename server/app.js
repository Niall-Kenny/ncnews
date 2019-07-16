const app = require("express")();
const { fetchTopics } = require("./controllers/controller-nc_news");

app.get("/api/topics", fetchTopics);

module.exports = app;
