const { authValidator } = require('../validators');
const { User, OAuth } = require('../dataBase');
const {
  ErrorHandler, errorMess: {
    RECORD_NOT_FOUND, EMAIL_PASSWORD, WRONG_TOKEN, NO_TOKEN
  }, statusCode
} = require('../errors');
const { constant: { AUTHORIZATION, REFRESH } } = require('../constants');
const { authHelper } = require('../helpers');

module.exports = {
  checkUser: async (req, res, next) => {
    try {
      const { email } = req.body;

      const { error } = await authValidator.login.validate(req.body);
      const newuser = await User.findOne({ email });

      if (error) {
        throw new ErrorHandler(statusCode.NOT_FOUND, error.details[0].message, RECORD_NOT_FOUND.code);
      }
      if (!newuser) {
        throw new ErrorHandler(statusCode.NOT_FOUND, RECORD_NOT_FOUND.message, RECORD_NOT_FOUND.code);
      }
      req.user = newuser;

      next();
    } catch (e) {
      next(e);
    }
  },
  checkAccessToken: async (req, res, next) => {
    try {
      const token = req.get(AUTHORIZATION);
      if (!token) {
        throw new ErrorHandler(statusCode.UNAUTHORIZED, NO_TOKEN.message, NO_TOKEN.code);
      }

      await authHelper.verifyToken(token);

      const tokenExist = await OAuth.findOne({ accessToken: token });

      if (!tokenExist.user) {
        throw new ErrorHandler(statusCode.DAD_REQUEST, EMAIL_PASSWORD.message, EMAIL_PASSWORD.code);
      }

      if (!tokenExist) {
        throw new ErrorHandler(statusCode.UNAUTHORIZED, WRONG_TOKEN.message, WRONG_TOKEN.code);
      }

      req.token = token;
      req.user = tokenExist.user;
      next();
    } catch (e) {
      next(e);
    }
  },
  checkRefreshToken: async (req, res, next) => {
    try {
      const token = req.get(AUTHORIZATION);

      if (!token) {
        throw new ErrorHandler(statusCode.UNAUTHORIZED, NO_TOKEN.message, NO_TOKEN.code);
      }

      await authHelper.verifyToken(token, REFRESH);
      const tokenObject = await OAuth.findOne({ refreshToken: token });

      if (!tokenObject) {
        throw new ErrorHandler(statusCode.UNAUTHORIZED, WRONG_TOKEN.message, WRONG_TOKEN.code);
      }

      req.user = tokenObject.user;

      next();
    } catch (e) {
      next(e);
    }
  }

};
