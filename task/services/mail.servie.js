const nodeMailer = require('nodemailer');
const path = require('path');
const EmailTemplates = require('email-templates');

const { EMAIL, PASSWORD } = require('../constants/constant');
const { ErrorHandler, errorMess } = require('../errors');
const templateInfo = require('../email.templates/index');

const templateParser = new EmailTemplates({
  views: {
    root: path.join(process.cwd(), 'email.templates')
  }
});

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

const sendMail = async (userMail, action, context = {}) => {
  const templateToSend = templateInfo[action];

  if (!templateToSend) {
    throw new ErrorHandler(200, errorMess.WRONG_TEMPLATE.message, errorMess.WRONG_TEMPLATE.code);
  }
  const html = await templateParser.render(templateToSend.templateName, context);

  return transporter.sendMail({
    from: 'No Reply',
    to: userMail,
    subject: templateToSend.subject,
    html
  });
};
module.exports = {
  sendMail
};
