const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Manejo de errores del pool
pool.on('error', (err, client) => {
  console.error('Error inesperado en el cliente inactivo', err);
  process.exit(-1);
});

module.exports = pool;

