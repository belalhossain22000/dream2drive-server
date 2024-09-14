import nodemailer from "nodemailer";
import config from "../../../config";


const vehicleEmailSender = async (
  userEmail: string, 
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
        rejectUnauthorized: true,
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

  } catch (error: any) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

export default vehicleEmailSender;
