import nodemailer from "nodemailer";
import config from "../../../config";
import ApiError from "../../errors/ApiErrors";

const vehicleEmailSender = async (
  userEmail: string, // The email of the user submitting the form
  htmlContent: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
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
      from: `"Collecting Cars" <${userEmail}>`, // sender address (website owner)
      to: `belalhossain22000@gmail.com`, // receiver address (website owner)
      subject: "New Vehicle Sourcing Request", // Subject line
      html: htmlContent, // HTML body content
      replyTo: userEmail, // Set the user's email as the reply-to address
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error: any) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

export default vehicleEmailSender;
