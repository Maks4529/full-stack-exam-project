let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

let transporter = null;

if (
  nodemailer &&
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

module.exports.sendMail = async ({ from, to, subject, text, html }) => {
  const payload = {
    from: from || process.env.SMTP_FROM || 'no-reply@example.com',
    to,
    subject,
    text,
    html,
  };

  if (!transporter) {
    return Promise.resolve();
  }

  return transporter.sendMail(payload);
};
