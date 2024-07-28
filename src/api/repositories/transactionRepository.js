const postgre = require('../database/index');

const transactionRepository = {
    async create(args){
        const { userId, cookieId, totalItems, totalPrice } = args;
        const sql = 'insert into transactions(userId, cookieId, totalItem, totalPrice, created_at, updated_at) ' +
                    'values($1, S2, $3, $4, $5, $6) returning *';
        const data = postgre.query(sql, [userId, cookieId, totalItems, totalPrice, new Date(), null]);
        return data[0];
    },
};

module.exports = transactionRepository;