// build and export your unconnected client here
const { Client } = require("pg"); // imports the pg module
const connectionString = process.env.DATABASE_URL || "https://localhost:5432/fitness-dev"
const client = new Client({
  connectionString
});

module.exports = client
