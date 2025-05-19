const { Pool } = require('pg');

const pool = new Pool({
  user: 'PostgreSQL 17',
  host: 'localhost',
  database: 'stock-data',
  password: 'root',
  port: 5432,
});

module.exports = pool;
