const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Hiba az adatbázishoz való kapcsolódáskor:', err);
  } else {
    console.log('Sikeres csatlakozás a Supabase-hez! Idő:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};