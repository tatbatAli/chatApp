import SendEmail from "./sendEmail.js";

const createEmailContent = (verifyEmailUrl, verifyUserUrl) => {
  return `
    Hello,

    Please click the following link to verify your email address:

    ${verifyEmailUrl}

    If you did not request this, please click the link below to cancel the verification:

    ${verifyUserUrl}

    Thank you,
  `;
};

const verificationEmail = async (user) => {
  const verifyEmailUrl = `${process.env.FRONT_URL}/auth/${user.id}/verify/${user.verificationToken}`;
  const verifyUserUrl = `${process.env.FRONT_URL}/auth/${user.id}/notMe`;
  const subject = "Verify Email";
  const htmlContent = createEmailContent(verifyEmailUrl, verifyUserUrl);

  await SendEmail(user.email, subject, htmlContent);
};

export default verificationEmail;
