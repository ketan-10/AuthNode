const express = require("express");

const controller = require("./auth.controller");
const middlewares = require("./auth.middlewares");

const auth = express.Router();
auth.get("/", controller.get);

auth.post("/signup",
  middlewares.isSchemaValid,
  middlewares.findUser((user) => ((user) ? "User Already exists" : null)),
  controller.signup);

auth.post("/login",
  middlewares.isSchemaValid,
  middlewares.findUser((user) => ((!user) ? "User does not exists" : null)),
  controller.login);

module.exports = auth;
