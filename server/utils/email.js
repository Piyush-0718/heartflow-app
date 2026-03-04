const nodemailer = require('nodemailer');

function getMailTransporter() {
  if (process.env.EMAIL_SERVER) {
    return nodemailer.createTransport(process.env.EMAIL_SERVER);
  }

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  return null;
}

async function sendEmail({ to, subject, text }) {
  const transporter = getMailTransporter();
  if (!transporter || !process.env.EMAIL_FROM) {
    return { sent: false, reason: 'smtp_not_configured' };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });

  return { sent: true };
}

module.exports = { sendEmail };

