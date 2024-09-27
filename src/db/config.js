import mysql from 'mysql2/promise';
import dotenv from 'dotenv/config';

const db = await mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: 'user_auth',
  port: 28249,
  connectionLimit: 10,
});

export default db;
