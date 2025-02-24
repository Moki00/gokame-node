require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, text, filePath) {
  try {
    const mailOptions = {
      from: `"Divine Backend" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      attachments: filePath
        ? [
            {
              filename: path.basename(filePath),
              path: filePath, // Attach uploaded file
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: ", info.messageId);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("❌ Email sending error: ", error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendEmail };
