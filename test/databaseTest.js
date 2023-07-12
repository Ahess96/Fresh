require('dotenv').config();
const { expect } = require('chai');
const { Pool } = require('pg');

describe('Database Configuration', function() {
    let pool;
  
    before(function() {
      require('dotenv').config();
      const env = process.env;
  
      pool = new Pool({
        user: env.RDS_USERNAME,
        host: env.RDS_HOSTNAME,
        password: env.RDS_PASSWORD,
        database: env.RDS_DB_NAME,
        ssl: {
          rejectUnauthorized: false,
        },
        port: env.RDS_PORT || 5432,
      });
    });
  
    after(function() {
      pool.end();
    });
  
    it('should connect to the database successfully', async function() {
      try {
        await pool.connect();
        console.log('Connected to the database');
        expect(true).to.be.true; // Assert that the connection was successful
      } catch (error) {
        console.error('Failed to connect to the database:', error);
        expect.fail('Failed to connect to the database');
      }
    });
  });
  