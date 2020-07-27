const db = require("../db/connection");
const users = db.get("users");
const bcrypt = require("bcryptjs");

async function createAdminUser() {
  try {
    const user = await users.findOne({ role: "admin" });
    if (!user) {
      users.insert({
        username: process.env.ADMIN_USERNAME,
        password: await bcrypt.hash(bcryptprocess.env.ADMIN_PASSWORD, 10),
        active: true,
        role: "admin",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
