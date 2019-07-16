exports.up = connection => {
  console.log("creating topics table!");
  return connection.schema.createTable("topics", table => {
    table.string("slug").primary();
    table.string("description");
  });
};

exports.down = connection => {
  console.log("deleting topics table!");
  return connection.schema.dropTableIfExists("topics");
};
