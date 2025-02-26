const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, errors } = require('../common/messages');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: errors.USER_EXISTS });
    }

    const user = new User({ name, email, passwordHash: password, role });
    await user.save();
    res.status(201).json({ message: success.USER_REGISTERED });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    var { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: errors.INVALID_CREDENTIALS });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: errors.INVALID_CREDENTIALS });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
