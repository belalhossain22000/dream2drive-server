import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (subject: string, email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "mail.dream2drive.com.au",
    port: 465,
    secure: true, 
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from:  `"Collecting Cars" <${config.emailSender.email}>`, 
    to: email,
    subject: `${subject}`, 
   
    html, 
  });

  console.log("Message sent: %s", info.messageId);
};

export default emailSender;
