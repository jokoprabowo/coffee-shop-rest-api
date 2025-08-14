const userService = require('../services/userService');

const userController = {
  async update(req, res) {
    try {
      const data = await userService.update(req.body, req.user.email);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'User data has been updated!',
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: 'INTERVAL ERROR',
        message: err.message,
      });
    }
  },

  async whoAmI(req, res) {
    res.status(201).json({
      status: 'SUCCESS',
      message: 'Your data have been retrieved!',
      data: req.user,
    });
  },
};

module.exports = userController;
