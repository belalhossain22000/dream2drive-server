import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (subject: string, email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false, // You can set this to false for Namecheap
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Dream2Drive" <${config.emailSender.email}>`,
      to: email,
      subject: subject,
      html: html,
      // Remove or set a valid Reply-To
    });

    console.log("Email sent: ", info.messageId); // Useful for tracking the email
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

export default emailSender;
