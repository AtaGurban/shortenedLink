import { Sequelize } from 'sequelize-typescript';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './utils/envConst.ts';

const sequelize = new Sequelize({
    dialect: 'postgres',
    password: DB_PASSWORD,
    host: DB_HOST,
    username: DB_USER,
    port: parseInt(DB_PORT || "5435", 10),
    database: DB_NAME,
    logging: false,
});

export default sequelize;
