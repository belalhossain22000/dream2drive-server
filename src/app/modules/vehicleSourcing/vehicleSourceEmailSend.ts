import nodemailer from "nodemailer";
import config from "../../../config";


const vehicleEmailSender = async (
  userEmail: string, // The email of the user submitting the form
  htmlContent: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.dream2drive.com.au",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
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
      to: `${config.emailSender.email}`, 
      subject: "New Vehicle Sourcing Request",
      html: htmlContent, 
      replyTo: userEmail, 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error: any) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

export default vehicleEmailSender;
