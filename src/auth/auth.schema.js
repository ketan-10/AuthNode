const Joi = require("joi");

const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(2).max(30)
    .required(),
  password: Joi.string().min(6).required(),
});

module.exports = schema;
