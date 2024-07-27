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

    async findOne(id){
        const sql = 'select * from cookies where id = $1';
        const { rows } = await postgre.query(sql, [id]);
        return rows[0];
    },

    async update(updateArgs, id){
        const { name, description, price, image } = updateArgs;
        const sql = 'update cookies set name = $1,  description = $2, price = $3, image = $4, updated_at = $5 ' +
                    'where id = $6 returning *';
        const { rows } = await postgre.query(sql, [name, description, price, image, new Date(), id]);
        return rows[0];
    }
}

module.exports = cookieRepository;