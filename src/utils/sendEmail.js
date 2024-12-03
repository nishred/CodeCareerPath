const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  FROM_EMAIL,
  FROM_NAME,
} = require("../config/nodemailer.config");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(options) {
  // send mail with defined transport object
  const message = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;
