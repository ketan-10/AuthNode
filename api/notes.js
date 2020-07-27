const express = require("express");
const Joi = require("joi");

const db = require("../db/connection");
const notes = db.get("notes");

const router = express.Router();

const schema = Joi.object().keys({
  title: Joi.string().trim().max(100).required(),
  note: Joi.string().trim().required(),
});

/**
 * User is logged in with req.user._id
 */

router.get("/", async (req, res) => {
  const user_notes = await notes.find({
    user_id: req.user._id,
  });

  res.json(user_notes);
});

router.post("/", async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    next(result.error);
    return;
  }
  const note = await notes.insert({
    ...req.body, 
    user_id: req.user._id,
  });

  res.json(note);
});

module.exports = router;
