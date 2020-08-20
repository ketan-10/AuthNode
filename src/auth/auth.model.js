const db = require("../db/connection.js");

const users = db.get("users");
// users.index('username');
users.createIndex("username", { unique: true });

module.exports = users;
