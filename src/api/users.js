const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const db = require("../db/connection");

const users = db.get("users");
const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(2).max(30),
  password: Joi.string().min(6),
  role: Joi.string().valid("user", "admin"),
  active: Joi.bool(),
});

router.get("/", async (req, res) => {
  res.json({
    users: await users.find({}, "-password"),
  });
});

router.patch("/:id", async (req, res, next) => {
  // validate patch request parameter

  try {
    const result = schema.validate(req.body);
    if (result.error) {
      next(result.error);
      return;
    }

    // get id form url
    const { id: _id } = req.params;

    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await users.findOneAndUpdate(
      { _id },
      { $set: updateData },
    );

    if (!updatedUser) {
      next(new Error(`User of id ${_id} not found`));
      return;
    }
    res.json({
      id: _id,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
