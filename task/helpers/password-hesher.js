const bcrypt = require('bcrypt');

const { ErrorHandler, errorMess: { USER_EMAIL_PASSWORD }, statusCode: { DAD_REQUEST } } = require('../errors');

module.exports = {
  compare: async (hashPassword, password) => {
    const isPasswordMatchet = await bcrypt.compare(hashPassword, password);

    if (!isPasswordMatchet) {
      throw new ErrorHandler(DAD_REQUEST, USER_EMAIL_PASSWORD.message, USER_EMAIL_PASSWORD.code);
    }
  },
  hash: (password) => bcrypt.hash(password, 10)
};
