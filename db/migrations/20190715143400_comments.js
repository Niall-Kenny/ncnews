exports.up = connection => {
  console.log("creating comments table!");
  return connection.schema.createTable("comments", table => {
    table.increments("comment_id").primary();
    table
      .string("author")
      .references("username")
      .inTable("users");
    table
      .integer("article_id")
      .references("article_id")
      .inTable("articles");
    table.string("votes").defaultsTo(0);
    table
      .timestamp("created_at", { useTz: false })
      .defaultTo(connection.fn.now());
    table.text("body");
  });
};

exports.down = connection => {
  console.log("deleting comments table!");
  return connection.schema.dropTableIfExists("comments");
};
