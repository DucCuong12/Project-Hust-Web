import mysql from 'mysql2/promise';
import dotenv from 'dotenv/config';

const db = await mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: 'user_auth',
  port: 28249,
  rowsAsArray: true,
});

export default db;
