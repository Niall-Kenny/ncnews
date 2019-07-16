exports.up = connection => {
  console.log("creating users table!");
  return connection.schema.createTable("users", table => {
    table.string("username", 30).primary();
    table.string("avatar_url").notNullable();
    table.string("name").notNullable();
  });
};

exports.down = connection => {
  console.log("deleting users table!");
  return connection.schema.dropTableIfExists("users");
};
