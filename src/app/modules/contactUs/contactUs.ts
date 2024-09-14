import nodemailer from "nodemailer";
import config from "../../../config";


const contactUsEmailSender = async (
  userEmail: string, 
  subject:string,
  htmlContent: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
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

    const mailOptions = {
      from: `"Collecting Cars" <${userEmail}>`, 
      to: `belalhossain22000@gmail.com`, 
      subject: subject, 
      html: htmlContent, 
      replyTo: userEmail,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error: any) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

export default contactUsEmailSender;
