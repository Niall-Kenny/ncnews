process.env.NODE_ENV = "test";

const app = require("../server/app.js");
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection.js");
const should = require("chai").should();

describe("/api", () => {
  beforeEach(() => {
    console.log("re-seeding!!!");
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
  describe("ERRORS", () => {
    it("returns 404 not found when requested a path that doesn't exist", () => {
      return request(app)
        .get("/api/path-non-existent")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal("404 Not Found");
        });
    });
  });
});
