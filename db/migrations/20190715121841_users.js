exports.up = connection => {
  return connection.schema.createTable("users", table => {
    table.string("username", 30).primary();
    table.string("avatar_url").notNullable();
    table.string("name").notNullable();
  });
};

exports.down = connection => {
  return connection.schema.dropTableIfExists("users");
};
