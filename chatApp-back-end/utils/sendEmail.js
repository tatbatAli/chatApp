import nodemailer from "nodemailer";

async function SendEmail(email, subject, htmlContent) {
  console.log(process.env.USER, process.env.PASS);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.PORT_EMAIL),
      secure: Boolean(process.env.SECURE),
      logger: Boolean(process.env.LOGGER),
      debug: Boolean(process.env.DEBUG),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: Boolean(process.env.REJECT_UNAUTHORIZED),
      },
    });

    const mailOption = {
      from: process.env.USER,
      to: email,
      subject: subject,
      text: htmlContent,
    };

    await transporter.sendMail(mailOption);
    console.log("Email Sent Successfully");
  } catch (error) {
    console.log("Email Not Sent");
    console.log(error);
  }
}

export default SendEmail;
