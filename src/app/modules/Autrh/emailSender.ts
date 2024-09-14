import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (subject: string, email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@dream2drive.com.au",
      pass: "dream2drive123@",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Collecting Cars" <${config.emailSender.email}>`,
      to: email,
      subject: `${subject}`,
      html,
      replyTo: "info@dream2drive.com.au",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Response envelope: ", info.envelope);
    console.log("Response message: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

export default emailSender;
