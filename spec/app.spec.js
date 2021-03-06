process.env.NODE_ENV = "test";

const { app } = require("../server/app.js");
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-sorted"));
const connection = require("../db/connection.js");
const should = require("chai").should();

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => connection.destroy());
  it("returns 404 not found when requested a path that doesn't exist", () => {
    return request(app)
      .get("/api/path-non-existent")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal("404 Not Found");
      });
  });
  describe("/topics", () => {
    it("should return an object with a key of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("Object");
          should.exist(body.topics);
        });
    });
    it("topics has a value of an array with nested objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("Array");
          expect(topics[0]).to.have.all.keys("slug", "description");
        });
    });

    describe("/preview", () => {
      it.only("GET should return an object with a key of `topicsPreview`", () => {
        return request(app)
          .get("/api/topics/preview")
          .expect(200)
          .then(({ body: { topicsPreview } }) => {
            expect(topicsPreview)
              .to.be.an("Object")
              .with.keys("articles", "topics");
          });
      });
      it("returns invalid method when an invalid request is sent", () => {
        const invalidMethods = ["put", "patch", "delete"];
        const testInvalidsMethods = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users/butter_bridge")
            .expect(405)
            .then(res => {
              expect(res.body.message).to.equal("method not allowed");
            });
        });
        return Promise.all(testInvalidsMethods);
      });
    });
  });
  describe("/users/:username", () => {
    it("GET/ returns a user object which should have the following properties:username,avatar_url, name", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.have.all.keys("username", "avatar_url", "name");
          expect(user).to.be.an("Object");
          expect(user.username).to.equal("butter_bridge");
        });
    });
    it("ERROR/ 404 and message to an invalid username /api/users/not-a-username", () => {
      return request(app)
        .get("/api/users/username-non-existent")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.equal("User Not Found");
        });
    });
    it("ERROR/returns 405 to a non existent method on /api/users/:username", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const testInvalidsMethods = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users/butter_bridge")
          .expect(405)
          .then(res => {
            expect(res.body.message).to.equal("method not allowed");
          });
      });
      return Promise.all(testInvalidsMethods);
    });
  });
  describe("/articles/article_id", () => {
    it("GET/ returns an object keyed with `article`", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("Object");
        });
    });
    it("the article object contains the following keys: author, title, article_id, body, topic, created_at,votes,comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.have.all.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("responds 200 with a article object when there are no comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.have.all.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(article.article_id).to.equal(2);
          expect(+article.comment_count).to.equal(0);
        });
    });
    it("GET/ returns 400 bad request using an id that could not exist on /api/articles/:article_id. The id hs to be an integer - sending  string will result in 400 ", () => {
      return request(app)
        .get("/api/articles/jeff")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` invalid input syntax for integer: "jeff"`);
        });
    });
    it("PATCH/  accepts an object in the form { inc_votes: newVote }.newVote will indicate how much the votes property in the database should be updated by.returns updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })

        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2018-11-15T12:21:54.171Z",
            votes: 101
          });
        });
    });
    it("ERROR /api/articles/:article_id returns 400 when `inc_votes` has an invalid value e.g. `cat` ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "cat" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` invalid input syntax for integer: "NaN"`);
        });
    });
    it("ERROR returns 404 on an article_id that doesn't exist for api/articles/:article_id", () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.equal("article doesn't exist");
        });
    });
    it("ERROR/ /article_id throws 400 on bad request e.g. `jeff`", () => {
      return request(app)
        .patch("/api/articles/jeff")
        .send({ inc_votes: 1 })

        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` invalid input syntax for integer: "jeff"`);
        });
    });

    it("ERROR/ returns 405 to a non existent method on /api/articles/:article_id", () => {
      const invalidMethods = ["put", "delete"];
      const testInvalidsMethods = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1")
          .expect(405)
          .then(res => {
            expect(res.body.message).to.equal("method not allowed");
          });
      });
      return Promise.all(testInvalidsMethods);
    });
  });
  describe("POST /api/:article_id/comments", () => {
    it("POST/returns an object with a key of comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "This is a new comment" })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).to.be.an("Object");
        });
    });
    it("POST/ returns an object containing keys of a comment obj`", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "This is a new comment" })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });
    it("POST/ updates 'author', and 'body' keys to username and body value", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "This is a new comment" })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.author).to.equal("butter_bridge");
          expect(comment.body).to.equal("This is a new comment");
        });
    });
    it("ERROR/ 404 for a non-existent id", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({ username: "butter_bridge", body: "This is a new comment" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.equal("Article does not exist");
        });
    });
    it("ERROR /jeff/comments throws 400, bad request", () => {
      return request(app)
        .post("/api/articles/jeff/comments")
        .send({ username: "butter_bridge", body: "This is a new comment" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` invalid input syntax for integer: "jeff"`);
        });
    });
    it("ERROR/ returns 405 to a non existent method on /api/articles/:article_id/comments", () => {
      const invalidMethods = ["put", "delete"];
      const testInvalidsMethods = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1")
          .expect(405)
          .then(res => {
            expect(res.body.message).to.equal("method not allowed");
          });
      });
      return Promise.all(testInvalidsMethods);
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("GET/ returns with an array of nested objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.an("Array");
          expect(comments.length).to.equal(13);
        });
    });
    it("contains comment keys", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments[0]).to.deep.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });
    it("returns sorted comments by `created_at` by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("created_at", { descending: true });
        });
    });
    it("returns sorted comments by `created_at` by default and order = `desc`", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("created_at", { descending: true });
        });
    });
    it("returns sorted comments by `comment_id` by default and order = `asc`", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("comment_id");
        });
    });
    it("returns 200 for an article id with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("comment_id");
        });
    });
    it("ERROR/ returns 404 article id not found if id is not present in data", () => {
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.equal("article id doesn't exist");
        });
    });
    it("ERROR/ returns 400 bad request if article id is not an integer", () => {
      return request(app)
        .get("/api/articles/cat/comments")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` invalid input syntax for integer: "cat"`);
        });
    });
    it("ERROR/ returns 400 bad request when trying to sort by a column that doesn't exist", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=Johnathan")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` column "Johnathan" does not exist`);
        });
    });
  });
  describe("GET /api/articles", () => {
    it("GET/ returns an object keyed with `articles` ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("Array");
          expect(articles.length).to.equal(12);
        });
    });
    it("GET/ articles contains objects with keys of: `author`, `title`, `article_id,topic`, `created_at`, `votes`,`comment_count`", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.be.an("Object");
          expect(articles[0]).to.contain.keys(
            `author`,
            `title`,
            `article_id`,
            `topic`,
            `created_at`,
            `votes`,
            `comment_count`
          );
        });
    });
    it("accepts a sort_by query which defaults to date & order default to descending)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("created_at", { descending: true });
          expect(articles[0]).to.contain.keys(
            `author`,
            `title`,
            `article_id`,
            `topic`,
            `created_at`,
            `votes`,
            `comment_count`
          );
        });
    });
    it("accepts a filter of author", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("created_at", { descending: true });
          expect(articles[0]).to.contain.keys(
            `author`,
            `title`,
            `article_id`,
            `topic`,
            `created_at`,
            `votes`,
            `comment_count`
          );
          expect(articles[0].author).to.equal("butter_bridge");
        });
    });
    it("filters by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("created_at", { descending: true });
          expect(articles[0]).to.contain.keys(
            `author`,
            `title`,
            `article_id`,
            `topic`,
            `created_at`,
            `votes`,
            `comment_count`
          );
          expect(articles[4].topic).to.equal("mitch");
          expect(articles.length).to.equal(11);
        });
    });
    it("handles non-default queries ", () => {
      return request(app)
        .get(
          "/api/articles?topic=mitch&author=butter_bridge&sort_by=article_id&order=asc"
        )
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("article_id", { descending: false });
          expect(articles[0]).to.contain.keys(
            `author`,
            `title`,
            `article_id`,
            `topic`,
            `created_at`,
            `votes`,
            `comment_count`
          );
          expect(articles[0].topic).to.equal("mitch");
          expect(articles.length).to.equal(3);
          expect(articles.every(article => article.author === "butter_bridge"))
            .to.true;
        });
    });
    it("ERROR 400 when attempting to sort by a non-existent column", () => {
      return request(app)
        .get("/api/articles?sort_by=notAcolumn")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` column "notAcolumn" does not exist`);
        });
    });
    it("ERROR 400 when attempting to set order to something other than asc or desc", () => {
      return request(app)
        .get("/api/articles?order=NotAnOrder")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal("invalid query");
        });
    });
    it("ERROR 404 if get with a non existant author", () => {
      return request(app)
        .get("/api/articles?author=imNotAnAuthor")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.equal(
            "Author is not in the database or does not have any articles associated with them"
          );
        });
    });
    it("ERROR 404 when searching for a non existent topic", () => {
      return request(app)
        .get("/api/articles?topic=imNotATopic")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.equal(
            "Topic is not in the database or does not have any articles associated with it"
          );
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    it("responds with an object keyed with `comment`", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).to.be.an("Object");
        });
    });
    it("PATCH should return 200 and an updated comment object with the new values", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).to.have.all.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(comment.votes).to.equal(17);
        });
    });
    it("PATCH ERROR returns 404 if comment_id does not exist", () => {
      return request(app)
        .patch("/api/comments/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.eql("comment id: 9999 does not exist");
        });
    });
    it("PATCH ERROR returns 400 if comment_id was in the incorrect format", () => {
      return request(app)
        .patch("/api/comments/NOT_AN_INTEGER")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.eql(
            ` invalid input syntax for integer: "NOT_AN_INTEGER"`
          );
        });
    });
    it("PATCH ERROR returns 400 if there is no body on the request", () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.eql("invalid request");
        });
    });
    it("PATCH ERROR returns 400 if the body on the request is in the incorrect format", () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(400)
        .send({ inc_votes: "banana" })
        .then(({ body: { message } }) => {
          expect(message).to.eql(` invalid input syntax for integer: "NaN"`);
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    it("should delete the comment and return 204 with no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).to.eql({});
        });
    });
    it("DELETE ERROR returns 404 if the comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.eql(`comment id: 9999 does not exist`);
        });
    });
    it("DELETE ERROR returns 400 if the comment_id is in the incorrect format", () => {
      return request(app)
        .delete("/api/comments/NOT_AN_INTEGER")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.eql(
            ` invalid input syntax for integer: "NOT_AN_INTEGER"`
          );
        });
    });
  });
});
