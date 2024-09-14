import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (subject: string, email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465 , 
    secure: true, 
    auth: {
      user: "info@dream2drive.com.au",
      pass:"dream2drive123@",
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

  // console.log("Message sent: %s", info.messageId);
};

export default emailSender;
