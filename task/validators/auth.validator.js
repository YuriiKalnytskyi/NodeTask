const Joi = require('joi');

const { regexp } = require('../constants');

module.exports = {
  login: Joi.object({

    email: Joi.string()
      .regex(regexp.EMAIl)
      .required(),

    password: Joi.string()
      .required()
      .regex(regexp.PASSWORD)
  })
};
