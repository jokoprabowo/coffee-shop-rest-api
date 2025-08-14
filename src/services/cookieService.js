const cookieRepository = require('../repositories/cookieRepository');

const cookieService = {
  async create(args) {
    try {
      const check = await cookieRepository.findOneByName(args.name);
      if (check) {
        throw new Error('Cookie already exist!');
      }
      const data = await cookieRepository.create(args);
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async findOne(id) {
    try {
      const data = await cookieRepository.findOne(id);
      if (!data) {
        throw new Error('Cookie not found!');
      }
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async findAll() {
    try {
      const data = await cookieRepository.findAll();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async update(args, id) {
    try {
      const check = await cookieRepository.findOne(id);
      if (!check) {
        throw new Error('Cookie not found!');
      }
      const data = await cookieRepository.update(args, id);
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

module.exports = cookieService;
