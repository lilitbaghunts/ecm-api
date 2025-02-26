const { errors } = require('../common/messages');

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: errors.ADMIN_ONLY });
  }
  next();
};

module.exports = isAdmin;
