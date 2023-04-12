import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql';
import util from 'util';
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT
});
connection.query = util.promisify(connection.query).bind(connection);

export default connection;
