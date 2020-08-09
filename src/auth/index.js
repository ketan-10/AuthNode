const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db/connection.js");

const users = db.get("users");
// users.index('username');
users.createIndex("username", { unique: true });

const auth = express.Router();

const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(2).max(30)
    .required(),
  password: Joi.string().min(6).required(),
});

auth.get("/", (req, res) => {
  res.json({
    message: "🔐",
  });
});

function createTokenSendResponse(user, res, next) {
  const jwtResult = jwt.sign(
    {
      _id: user._id,
      username: user.username,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );

  if (!jwtResult) {
    next(new Error("Failed to generate JWT"));
    return;
  }

  res.json({
    token: jwtResult,
  });
}

auth.post("/signup", async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    next(result.error);
    return;
  }

  const user = await users.findOne({
    username: req.body.username,
  });

  if (user) {
    next(new Error("User Already exists"));
    return;
  }

  const hashPassword = await bcrypt.hash(req.body.password, 12);
  const insertedUser = await users.insert({
    username: req.body.username,
    password: hashPassword,
    role: "user",
    active: true,
  });

  createTokenSendResponse(insertedUser, res, next);
});

auth.post("/login", async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    next(result.error);
    return;
  }

  const user = await users.findOne({
    username: req.body.username,
  });

  if (!user) {
    next(new Error("User does not exists"));
    return;
  }

  const bcryptHash = await bcrypt.compare(req.body.password, user.password);

  if (!bcryptHash) {
    next(new Error("Password does not match"));
    return;
  }
  createTokenSendResponse(user, res, next);
});

module.exports = auth;
