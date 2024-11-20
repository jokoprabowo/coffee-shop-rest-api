const { verifyToken } = require('../utilities/token');
const userService = require('../services/userService');

const authorization = {
  async authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split('Bearer ')[1];
      const tokenPayload = verifyToken(token);

      req.user = await userService.findOne(tokenPayload.email);
      next();
    } catch (err) {
      console.log(err.message);
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  },

  async cookiesAuth(req, res, next) {
    try {
      const token = req.headers.cookie.split('=')[1];
      const user = verifyToken(token);
      req.user = user;
      next();
    } catch (err) {
      res.clearCookie('token');
      res.status(401).json({
        status: 'Unauthorized!',
        message: err.message,
      });
    }
  },
};

module.exports = authorization;
