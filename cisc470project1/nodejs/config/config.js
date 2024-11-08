// config/config.js
require('dotenv').config();

module.exports = {
    development: {
        database: process.env.DB_NAME || 'todo',
        username: process.env.DB_USER || 'jingkunzhang',
        password: process.env.DB_PASSWORD || '123',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    },
    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    },
    jwtSecret: process.env.JWT_SECRET || '123',
    tokenExpiration: process.env.TOKEN_EXPIRATION || '1h'
};
