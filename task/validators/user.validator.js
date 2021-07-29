const Joi = require('joi');

const { regexp } = require('../constants');

module.exports = {
  createUser: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50),

    email: Joi.string()
      .regex(regexp.EMAIl)
      .required(),

    password: Joi.string()
      .required()
      .regex(regexp.PASSWORD)
  }),

  updateUser: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50),

    email: Joi.string()
      .regex(regexp.EMAIl),

    password: Joi.string()
      .regex(regexp.PASSWORD)
  }),
  forgotPassword: Joi.string()
    .regex(regexp.PASSWORD)
};
