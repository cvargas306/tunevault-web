// db.js
// Creates one shared PostgreSQL connection pool for the whole app.
// The connection string comes from the DATABASE_URL variable in .env.

require('dotenv').config();
const { Pool } = require('pg');

// A pool keeps a few database connections open and reuses them,
// so each request does not have to open a brand-new connection.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;