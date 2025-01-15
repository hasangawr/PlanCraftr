import { EmailType } from '../../../../globals/utils/emailTemplates';

const makeSendPasswordResetLink = (
  formatEmail: (link: string, type: EmailType) => string | undefined,
  verifyConnection: () => Promise<boolean>,
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

    const smtpServerConnected = await verifyConnection();

    if (smtpServerConnected) {
      await sendEMail(
        process.env.EMAIL as string,
        email,
        'Reset Password',
        formattedEmail as string,
      );
    }
  };

  return sendPasswordResetLink;
};

export default makeSendPasswordResetLink;
