const Joi = require('joi');

// User validation
const registerValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
});

const loginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Post validation
const postValidation = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.string().optional()
});

module.exports = {
  registerValidation,
  loginValidation,
  postValidation
};