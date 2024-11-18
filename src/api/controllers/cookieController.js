const cookieService = require('../services/cookieService');

const cookieController = {
  async create(req, res) {
    try {
      const data = await cookieService.create(req.body);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Cookie has been added!',
        data,
      });
    } catch (err) {
      if (err.message === 'Cookie already exist!') {
        res.status(400).json({
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

  async getOne(req, res) {
    try {
      const data = await cookieService.findOne(req.params.id);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Cookie has been retrieved!',
        data,
      });
    } catch (err) {
      if (err.message === 'Cookie not found!') {
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

  async getAll(req, res) {
    try {
      const data = await cookieService.findAll();
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Cookies has been retrieved!',
        data,
      });
    } catch (err) {
      if (err.message === 'Cookie not found!') {
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
      const data = await cookieService.update(req.body, req.params.id);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Cookies has been updated!',
        data,
      });
    } catch (err) {
      if (err.message === 'Cookie not found!') {
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

module.exports = cookieController;
