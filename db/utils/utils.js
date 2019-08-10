const formatDates = list => {
  if (!list.length) return [];
  const updatedList = list.map(({ created_at, ...restOfList }) => {
    return { created_at: new Date(created_at), ...restOfList };
  });

  return updatedList;
};

const makeRefObj = list => {
  const ref = {};
  list.forEach(
    ({ title, article_id, ...restOfList }) => (ref[title] = article_id)
  );
  return ref;
};

const formatComments = (comments, articleRef) => {
  return comments.map(({ created_by, created_at, belongs_to, ...comment }) => {
    return {
      author: created_by,
      article_id: articleRef[belongs_to],
      created_at: new Date(created_at),
      ...comment
    };
  });
};

const formatTopicsPreview = arrayOfArticlesAndTopics => {
  const topicsPreview = {};
  topicsPreview.articles = {};

  for (let i = 0; i < arrayOfArticlesAndTopics.length; i++) {
    if (arrayOfArticlesAndTopics[i].length < 1) i++;
    if (arrayOfArticlesAndTopics[i][0].slug) {
      topicsPreview.topics = arrayOfArticlesAndTopics[i];
    }
    if (arrayOfArticlesAndTopics[i][0].topic) {
      topicsPreview.articles[arrayOfArticlesAndTopics[i][0].topic] =
        arrayOfArticlesAndTopics[i];
    }
  }
  return topicsPreview;
};
// return { articles: { mitch: [], cats: [] }, topics: 2 };

// const TopicsPreview = {
//   topics: arrayOfArticlesAndTopics
//     .filter(element => element)
//     .map(element => element)
// };

module.exports = {
  formatDates,
  formatComments,
  makeRefObj,
  formatTopicsPreview
};
