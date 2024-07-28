const postgre = require('../database/index');

const transactionRepository = {
    async create(args){
        const { userId, cookieId, totalItems, totalPrice } = args;
        const sql = 'insert into transactions(userId, cookieId, totalItem, totalPrice, created_at, updated_at) ' +
                    'values($1, S2, $3, $4, $5, $6) returning *';
        const { rows } = await postgre.query(sql, [userId, cookieId, totalItems, totalPrice, new Date(), null]);
        return rows[0];
    },

    async findAll(){
        const sql = 'select * from transactions';
        const { rows } = await postgre.query(sql);
        return rows;
    },

    async findOne(id){
        const sql = 'select * from transactions where id = $1';
        const { rows } = await postgre.query(sql, [id]);
        return rows[0];
    }
};

module.exports = transactionRepository;