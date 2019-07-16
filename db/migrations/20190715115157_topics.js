exports.up = connection => {
  console.log("topics table");
  return connection.schema.createTable("topics", table => {
    table.string("slug").primary();
    table.string("description");
  });
};

exports.down = connection => {
  return connection.schema.dropTableIfExists("topics");
};