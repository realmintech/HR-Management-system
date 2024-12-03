exports.paginateResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    try {
      const total = await model.countDocuments();

      const pagination = {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      };

      req.pagination = pagination;
      req.startIndex = startIndex;
      req.limit = limit;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
