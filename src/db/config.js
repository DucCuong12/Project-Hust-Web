import mysql2 from 'mysql2';

const db = mysql2.createConnection({
  host: 'mysql-310262b9-fujisyousuke-b8cb.i.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS__G8gkwjlZcM9kTe4BcH',
  database: 'defaultdb',
  port: 28249,
});

export default db;
