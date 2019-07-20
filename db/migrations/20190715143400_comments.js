exports.up = connection => {
  return connection.schema.createTable("comments", table => {
    table.increments("comment_id").primary();
    table
      .string("author")
      .notNullable()
      .references("username")
      .inTable("users");
    table
      .integer("article_id")
      .references("article_id")
      .inTable("articles");
    table.integer("votes").defaultsTo(0);
    table
      .timestamp("created_at", { useTz: false })
      .defaultTo(connection.fn.now());
    table.text("body").notNullable();
  });
};

exports.down = connection => {
  return connection.schema.dropTableIfExists("comments");
};
