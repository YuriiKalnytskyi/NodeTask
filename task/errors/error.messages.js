module.exports = {

  UNKNOWN_ERROR: {
    message: 'Unknown_error',
    code: 0
  },
  WRONG_TEMPLATE: {
    message: 'Wrong template',
    code: '200.1'
  },

  ROUTE_NOT_FOUND: {
    message: 'Route not fond',
    code: 404
  },
  RECORD_NOT_FOUND: {
    message: 'Record not found',
    code: '404.0'
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    code: '404.0'
  },
  USER_EMAIL_PASSWORD: {
    message: 'login or password is incorrect',
    code: '400.3'
  },
  AVATAR: {
    message: 'Just one avatar per user',
    code: '409.0'
  },
  NO_TOKEN: {
    message: 'No token',
    code: '401.0'
  },
  WRONG_TOKEN: {
    message: 'Wrong token',
    code: '401.1'
  },
  EMAIL_PASSWORD: {
    message: 'Wrong email or password',
    code: '400.4'
  },
  USER_EMAIL: {
    message: 'user is login',
    code: '400.1'
  },

};
