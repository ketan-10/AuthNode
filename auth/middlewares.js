const express = require("express");
const jwt = require("jsonwebtoken");

function checkTokenSetUser(req, res, next) {
  try {
    const authorization = req.get("authorization");
    const token = authorization.split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (user) {
          req.user = user;
        }
      });
    }
  } catch (err) {
    console.log("not logged in");
  } finally {
    next();
  }
}

function isLoggedin(req, res, next) {
  if (req.user) {
    next();
  } else {
    next(new Error("User not Logged in"));
  }
}

module.exports = {
  checkTokenSetUser,
  isLoggedin,
};
