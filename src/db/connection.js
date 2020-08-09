const monk = require("monk");

let dbUrl = process.env.DB_URL;

if (process.env.NODE_ENV === "test") {
  dbUrl = process.env.DB_URL_TEST;
}

const db = monk(dbUrl);

module.exports = db;
