const knex = require("knex");
const dbconfig = require("../knexfile");

const connection = knex(dbconfig);

module.exports = connection;
