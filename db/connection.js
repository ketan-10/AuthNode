const monk = require("monk");

const db = monk("localhost/auth-node");

module.exports = db;
