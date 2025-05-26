import SendEmail from "./sendEmail.js";

const createForgetPwdContent = (resetPasswordUrl) => {
  return `
    Hello,

    We received a request to reset the password for your account. If you did not request this, please ignore this email.

    To reset your password, please click the following link:

    ${resetPasswordUrl}


    Thank you,
  `;
};

const forgetPwd = async (user) => {
  const resetPwdUrl = `${process.env.FRONT_URL}/auth/${user._id}/ResetPwd`;
  const subject = "Reset Password";
  const htmlContent = createForgetPwdContent(resetPwdUrl);

  await SendEmail(user.email, subject, htmlContent);
};

export default forgetPwd;
