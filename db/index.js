// require and re-export all files in this db directory (users, activities...)
const { Client } = require("pg"); // imports the pg module
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });


module.exports = {
client
}