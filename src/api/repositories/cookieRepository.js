const postgre = require('../database/index');

const cookieRepository = {
    async create(createArgs){
        const { name, description, price, image } = createArgs;
        const sql = 'insert into cookies(name, description, price, image, created_at, updated_at) ' +
                    'values($1, $2, $3, $4, $5, $6) returning *';
        const { rows } = await postgre.query(sql, [name, description, price, image, new Date(), null]);
        return rows[0];
    },

    async findAll(){
        const sql = 'select * from cookies';
        const { rows } = await postgre.query(sql);
        return rows;
    },

    async findOne(name){
        const sql = 'select * from cookies where name = $1';
        const { rows } = await postgre.query(sql, [name]);
        return rows[0];
    },
}

module.exports = cookieRepository;