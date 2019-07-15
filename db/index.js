const test = require("./data/test-data/index");
const development = require("./data/development-data/index");

const ENV = process.env.NODE_ENV || "development";

const data = {
  test,
  development
};

module.exports = data[ENV];
