const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const { constant: { REGISTRY_TOKEN_SECRET, REGISTRY_TOKEN_TIME } } = require('../constants');

const verifyPromisse = promisify(jwt.verify);

module.exports = {
  userNormalizator: (userToNormalize = {}) => {
    const fieldsToRemove = ['password'];

    fieldsToRemove.forEach((filed) => {
      delete userToNormalize[filed];
    });
    return userToNormalize;
  },

  authorizationToken: () => {
    const authorization_Token = jwt.sign({}, REGISTRY_TOKEN_SECRET, { expiresIn: REGISTRY_TOKEN_TIME });

    return {
      authorization_Token
    };
  },
  verifyAuthorizationToken: async (token) => {
    await verifyPromisse(token, REGISTRY_TOKEN_SECRET);
  }
};
