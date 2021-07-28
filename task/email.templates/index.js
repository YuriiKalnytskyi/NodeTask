const { WELCOME, UPDATE, DELETE } = require('../constants/emailActionsEnum');

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
  }
};
