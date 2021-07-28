const Joi = require('joi');

module.exports = {
  id: Joi.string()
    .min(24)
    .max(24)
    .id()
};
