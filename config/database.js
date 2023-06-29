require('dotenv').config();
const env = process.env;
const { Pool } = require('pg');

const pool = new Pool({
  user: env.RDS_USERNAME,
  host: env.RDS_HOSTNAME,
  password: env.RDS_PASSWORD,
  database: env.RDS_DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Set to false if using self-signed SSL certificate
  },
  port: env.RDS_PORT || 5432, // Use RDS_PORT from environment variables or default to 5432
});

// Test the connection
pool
  .connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

module.exports = pool;


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

// const { Client } = require('pg');

// const client = new Client({
//     user: env.RDS_USERNAME,
//     host: env.RDS_HOSTNAME,
//     password: env.RDS_PASSWORD,
//     database: env.RDS_DB_NAME,
//     port: 5432
// });
// // set up pool connection
// client.connect()
//   .then(() => {
//     console.log('Connected to the database');
//     // Perform queries or other database operations
//   })
//   .catch(error => {
//     console.error('Error connecting to the database', error);
//   });

//   module.exports = client;

//   fetchData();
