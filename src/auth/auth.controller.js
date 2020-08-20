const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("./auth.model");

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

const get = (req, res) => {
  res.json({
    message: "🔐",
  });
};

const signup = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    const insertedUser = await users.insert({
      username: req.body.username,
      password: hashPassword,
      role: "user",
      active: true,
    });

    createTokenSendResponse(insertedUser, res, next);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const bcryptHash = await bcrypt.compare(req.body.password, req.loggingInUser.password);

    if (!bcryptHash) {
      next(new Error("Password does not match"));
      return;
    }
    createTokenSendResponse(req.loggingInUser, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  get,
  signup,
  login,
};
