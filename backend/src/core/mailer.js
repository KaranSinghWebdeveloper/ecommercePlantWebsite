const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Use console logging transporter for development if no SMTP credentials exist
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("⚠️ SMTP credentials not found in .env. Using mock emailer that logs to console.");
    return {
      sendMail: async (mailOptions) => {
        console.log("\n=======================================================");
        console.log("Mock Email Sent!");
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Text Body: ${mailOptions.text}`);
        console.log("=======================================================\n");
        return { messageId: 'mock-id' };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Haryali Plants" <noreply@haryaliplants.com>',
    to,
    subject,
    text,
    html
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail
};
