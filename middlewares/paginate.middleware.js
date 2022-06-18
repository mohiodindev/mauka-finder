module.exports.results = (model) => (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit) || 7;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < model.countDocuments()) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  next();
};
