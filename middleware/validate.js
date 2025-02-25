const Joi = require("joi");

// 🔹 Валидация регистрации
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// 🔹 Валидация логина
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// 🔹 Валидация привычки
const habitSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
});

module.exports = { registerSchema, loginSchema, habitSchema };
