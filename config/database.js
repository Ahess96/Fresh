require('dotenv').config();
const env = process.env;
// const { Pool } = require('pg');

// const pool = new Pool({
//     user: env.RDS_USERNAME,
//     host: env.RDS_HOSTNAME,
//     password: env.RDS_PASSWORD,
//     database: env.RDS_DB_NAME,
//     ssl: true,
//     port: 5432, // default PostgreSQL port
//   });

//   async function fetchData() {
//     let client;
//     try {
//         // start database transaction
//         client = await pool.connect();
//         await client.query('BEGIN');
//         let colors = await client.query('SELECT * FROM colors');
//         console.log(colors)
//     } catch (err) {
//         console.error(err)
//     } finally {
//         if (client) {
//             client.release();
//         }
//     }
//   }

const { Client } = require('pg');

const client = new Client({
    user: env.RDS_USERNAME,
    host: env.RDS_HOSTNAME,
    password: env.RDS_PASSWORD,
    database: env.RDS_DB_NAME,
    port: 5432
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
    // Perform queries or other database operations
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });

  module.exports = client;

//   fetchData();
