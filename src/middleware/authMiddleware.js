const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errors } = require('../common/messages');

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ message: errors.ACCESS_DENIED });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: errors.USER_NOT_FOUND });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).send(errors.INVALID_TOKEN);
  }
};

module.exports = auth;
