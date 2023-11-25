const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const verifyTransporter = async () => {
  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(success);
        resolve(success);
      }
    });
  });
};

const sendEmail = async (mailOptions) => {
  try {
    await verifyTransporter();
    await transporter.sendMail(mailOptions);
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmail };
