const transactionService = require('../services/transactionService');

const transactionController = {
  async create(req, res) {
    try {
      const data = await transactionService.create(req.user.email, req.body);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Transaction success!',
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: 'INTERNAL ERROR',
        message: err.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const data = await transactionService.findAll();
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Transactions data have been retrieved!',
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: 'INTERNAL ERROR',
        message: err.message,
      });
    }
  },

  async getOne(req, res) {
    try {
      const data = await transactionService.findOne(req.params.id);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Transaction has been retrieved!',
        data,
      });
    } catch (err) {
      if (err.message === 'Transaction not found!') {
        res.status(404).json({
          status: 'FAIL',
          message: err.message,
        });
      } else {
        res.status(500).json({
          status: 'INTERNAL ERROR',
          message: err.message,
        });
      }
    }
  },

  async update(req, res) {
    try {
      const data = await transactionService.update(req.body, req.params.id);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Transaction has been updated!',
        data,
      });
    } catch (err) {
      if (err.message === 'Transaction not found!') {
        res.status(404).json({
          status: 'FAIL',
          message: err.message,
        });
      } else {
        res.status(500).json({
          status: 'INTERNAL ERROR',
          message: err.message,
        });
      }
    }
  },
};

module.exports = transactionController;
