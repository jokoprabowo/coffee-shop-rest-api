const jwt = require('jsonwebtoken');

module.exports = {
  createToken(token) {
    try {
      return jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
