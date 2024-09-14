import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (subject: string, email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Collecting Cars" <${config.emailSender.email}>`,
      to: email,
      subject: `${subject}`,
      html,
      replyTo: email,
    });
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

export default emailSender;
