process.env.NODE_ENV = "test";

const app = require("../server/app.js");
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection.js");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    describe("/GET", () => {
      it("should return an object keyed with 'topic' which has a value of an array with nested topic objects containing a description and a post ", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(body => {
            expect(body).to.be.an("Object");
          });
      });
    });
  });
});
