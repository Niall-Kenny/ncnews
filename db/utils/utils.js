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

module.exports = { formatDates, formatComments, makeRefObj };
