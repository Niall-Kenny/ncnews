process.env.NODE_ENV = "test";

const { app } = require("../server/app.js");
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection.js");
const should = require("chai").should();

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => connection.destroy());
  describe("/topics", () => {
    describe("/GET", () => {
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
    it.only("PATCH/  accepts an object in the form { inc_votes: newVote }.newVote will indicate how much the votes property in the database should be updated by.returns updated article", () => {
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
  });
  describe("ERRORS", () => {
    it("returns 404 not found when requested a path that doesn't exist", () => {
      return request(app)
        .get("/api/path-non-existent")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal("404 Not Found");
        });
    });
    it("returns 404 and message to an invalid username /api/users/not-a-username", () => {
      return request(app)
        .get("/api/users/username-non-existent")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).to.equal("User Not Found");
        });
    });

    it("returns 405 to a non existent method on /api/users/:username", () => {
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
    it("returns 400 bad request using an id that could not exist on /api/articles/:article_id. The id hs to be an integer - sending  string will result in 400 ", () => {
      return request(app)
        .get("/api/articles/jeff")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).to.equal(` invalid input syntax for integer: "jeff"`);
        });
    });
    it("returns 404 on an article_id that doesn't exist for api/articles/:article_id", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(() => {});
    });
  });
});
