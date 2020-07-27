const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const auth = require("./auth/index.js");
const middleware = require("./auth/middlewares");
const notes = require("./api/notes");
const users = require("./api/users");

const app = express();
require("dotenv").config();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://localhost:8080",
  })
);

app.use(express.json());
app.use(middleware.checkTokenSetUser);

app.use("/api/v1/notes", middleware.isLoggedin, notes);
app.use("/auth", auth);
app.use("/users", users);

app.get("/", (req, res) => {
  res.json({
    hello: "ketan",
  });
});

// const port = process.env.PORT || 5000;

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not found ${req.orininalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
