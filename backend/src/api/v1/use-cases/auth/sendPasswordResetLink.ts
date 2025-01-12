import { AppError } from '../../../../globals/utils/AppError';
import { EmailType } from '../../../../globals/utils/emailTemplates';

const makeSendPasswordResetLink = (
  formatEmail: (link: string, type: EmailType) => string | undefined,
  sendEMail: (
    from: string,
    to: string,
    subject: string,
    html: string,
  ) => Promise<void>,
) => {
  const sendPasswordResetLink = async (key: string, email: string) => {
    const link = `${process.env.BASE_API_URL}/v1/auth/forgot-password?key=${key}`;
    const formattedEmail = formatEmail(link, EmailType.ResetPassword);

    try {
      await sendEMail(
        process.env.EMAIL as string,
        email,
        'Reset Password',
        formattedEmail as string,
      );
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      throw new AppError(
        'Error sending password reset email',
        500,
        'Password reset message sending failed',
        false,
      );
    }
  };

  return sendPasswordResetLink;
};

export default makeSendPasswordResetLink;
