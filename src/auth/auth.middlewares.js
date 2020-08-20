const jwt = require("jsonwebtoken");
const schema = require("./auth.schema");

const users = require("./auth.model");

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

function isAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }
  return next(new Error("Not admin"));
}

function isSchemaValid(req, res, next) {
  const result = schema.validate(req.body);
  if (result.error) {
    return  next(result.error);
  }
  return next();
}

function findUser(isError) {
  return async (req, res, next) => {
    const user = await users.findOne({
      username: req.body.username,
    });
    const err = isError(user);
    if (err) {
      return next(new Error(err));
    }
    req.loggingInUser = user;
    return next();
  };
}

module.exports = {
  checkTokenSetUser,
  isLoggedin,
  isAdmin,
  isSchemaValid,
  findUser,
};
