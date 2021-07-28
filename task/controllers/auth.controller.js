const { authHelper, passwordHesher } = require('../helpers');
const { OAuth } = require('../dataBase');
const { constant } = require('../constants');
const { statusCode } = require('../errors');

module.exports = {
  login: async (req, res, next) => {
    try {
      const { password: hashPassword, _id } = req.user;
      const { password } = req.body;

      await passwordHesher.compare(password, hashPassword);

      const tokenPair = authHelper.generateTokenPair();

      await OAuth.create({ ...tokenPair, user: _id });

      res.json({ ...tokenPair, user: req.user });
    } catch (e) {
      next(e);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { token } = req;

      console.log(token);

      await OAuth.remove({ accessToken: token });

      res.status(statusCode.DELETED).json('Success');
    } catch (e) {
      next(e);
    }
  },
  refresh: async (req, res, next) => {
    try {
      const token = req.get(constant.AUTHORIZATION);
      const { _id } = req.user;

      await OAuth.remove({ refreshToken: token });

      const tokenPair = authHelper.generateTokenPair();

      await OAuth.create({ ...tokenPair, user: _id });

      res.json({ ...tokenPair, user: req.user });
    } catch (e) {
      next(e);
    }
  }
};
