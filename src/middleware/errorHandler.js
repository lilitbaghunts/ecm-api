module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(400).json({ error: err.message });
};
