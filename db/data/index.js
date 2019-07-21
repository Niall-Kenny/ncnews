const ENV = process.env.NODE_ENV || "development";

const test = require("./test-data");
const development = require("./development-data");

const data = {
  test,
  development,
  production: development
};

module.exports = data[ENV];
