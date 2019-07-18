exports.up = connection => {
  return connection.schema.createTable("articles", table => {
    table.increments("article_id").primary();
    table.string("title").notNullable();
    table.text("body").notNullable();
    table.integer("votes").defaultTo(0);
    table
      .string("topic")
      .references("slug")
      .inTable("topics");
    table
      .string("author")
      .references("username")
      .inTable("users");
    table
      .timestamp("created_at", { useTz: false })
      .defaultTo(connection.fn.now());
  });
};

exports.down = connection => {
  return connection.schema.dropTableIfExists("articles");
};
