const {
  WELCOME, UPDATE, DELETE, FORGOT_PASSWORD, PASSWORD_CHANGED
} = require('../constants/emailActionsEnum');

module.exports = {
  [WELCOME]: {
    templateName: 'welcome',
    subject: 'Welcome on board'
  },
  [UPDATE]: {
    templateName: 'update',
    subject: 'user update'
  },
  [DELETE]: {
    templateName: 'delete',
    subject: 'user delete'
  },
  [FORGOT_PASSWORD]: {
    templateName: 'forgot_token',
    subject: 'password recovery'
  },
  [PASSWORD_CHANGED]: {
    templateName: 'password_changed',
    subject: 'password changed'
  }
};
