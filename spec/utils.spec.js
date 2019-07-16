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
  it("takes a comment array,returns the object unmutated and an updated timestamp", () => {
    const comment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const result = formatDates(comment);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    expect(result).to.eql(expected);
  });
  it("returns formatted timestamp for an array with multiple comments", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];
    const result = formatDates(comments);
    expect(result).to.eql(expected);
  });
  it("returns article and formatted date", () => {
    const article = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    const result = formatDates(article);
    expect(result).to.eql(expected);
  });
  it("does not mutate original array", () => {
    const article = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    const control = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const result = formatDates(article);
    expect(result).to.eql(expected);
    expect(article).to.eql(control);
  });
});

describe("makeRefObj", () => {
  it("takes an empty array and returns an empty obj", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("takes an array with a nested aritcle object. Returns a reference object. The key is equal to the title value and key equal to the article id", () => {
    expect(makeRefObj([{ article_id: 1, title: "A" }])).to.eql({ A: 1 });
  });
  it("returns obj reference for multiple nested objects", () => {
    expect(
      makeRefObj([{ article_id: 1, title: "A" }, { article_id: 2, title: "B" }])
    ).to.eql({ A: 1, B: 2 });
  });
  it("does not mutate input", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
        article_id: 1
      }
    ];
    const control = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
        article_id: 1
      }
    ];
    const expected = { "Living in the shadow of a great man": 1 };
    const result = makeRefObj(input);
    expect(result).to.eql(expected);
    expect(input).to.eql(control);
  });
});

describe.only("formatComments", () => {
  it("take an array and returns an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("takes an array with a nested comment obj. The `created_by` property is replaced by `author`", () => {
    const input = [
      {
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const articleRef = { "They're not exactly dogs, are they?": 1 };
    const result = formatComments(input, articleRef);

    expect(result[0].author).to.equal("butter_bridge");
    expect(result[0].created_by).to.be.undefined;
  });
  it("Its `belongs_to` property renamed to an `article_id` key", () => {
    const input = [
      {
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const result = formatComments(input, ref);
    expect(result[0].article_id).to.equal(1);
    expect(result[0].belongs_to).to.be.undefined;
  });
  it("Its `created_at` value converted into a javascript date object", () => {
    const input = [
      {
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const result = formatComments(input, ref);
    expect(result[0].created_at).to.eql(new Date(1511354163389));
  });
  it("returns expected array for multiple nested objects", () => {
    const input = [
      {
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        belongs_to: "Margret thatcher?",
        created_by: "Johnathan",
        votes: 27,
        created_at: 1511354163389
      }
    ];
    const ref = {
      "They're not exactly dogs, are they?": 1,
      "Margret thatcher?": 2
    };
    const expected = [
      {
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        article_id: 2,
        author: "Johnathan",
        votes: 27,
        created_at: new Date(1511354163389)
      }
    ];
    const result = formatComments(input, ref);
    expect(result).to.eql(expected);
  });
  it("doesn't mutate input", () => {
    const input = [
      {
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        belongs_to: "Margret thatcher?",
        created_by: "Johnathan",
        votes: 27,
        created_at: 1511354163389
      }
    ];
    const ref = {
      "They're not exactly dogs, are they?": 1,
      "Margret thatcher?": 2
    };
    const expected = [
      {
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        article_id: 2,
        author: "Johnathan",
        votes: 27,
        created_at: new Date(1511354163389)
      }
    ];
    const controlComment = [
      {
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        belongs_to: "Margret thatcher?",
        created_by: "Johnathan",
        votes: 27,
        created_at: 1511354163389
      }
    ];
    const controlRef = {
      "They're not exactly dogs, are they?": 1,
      "Margret thatcher?": 2
    };
    const result = formatComments(input, ref);
    expect(result).to.eql(expected);
    expect(input).to.eql(controlComment);
    expect(ref).to.eql(controlRef);
  });
});
