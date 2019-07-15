const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("should return an empty array when given empty array", () => {
    expect(formatDates([])).to.eql([]);
    expect(formatDates([])).to.be.an("Array");
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
