import { AppError } from '../../../../globals/utils/AppError';
import { EmailType } from '../../../../globals/utils/emailTemplates';
import { IMakeTempUserModel } from '../../data-access/interfaces/ITempUserDto';
import { IMakeUserModel } from '../../data-access/interfaces/IUserDto';
import ITempUser from '../interfaces/ITempUser';

const makeRegisterUser = (
  tempUserModel: IMakeTempUserModel,
  permUserModel: IMakeUserModel,
  hashPassword: (password: string) => Promise<string>,
  formatEmail: (link: string, type: EmailType) => string | undefined,
  verifyConnection: () => Promise<boolean>,
  sendEmail: (from: string, to: string, subject: string, html: string) => void,
) => {
  const registerUser = async (
    name: string,
    email: string,
    password: string,
  ): Promise<ITempUser> => {
    const userExist = await permUserModel.findByEmail(email);

    if (userExist) {
      throw new AppError(
        'User with this email already exist',
        400,
        'User with this email already exist',
        true,
      );
    }

    const hashedPassword = await hashPassword(password);

    const createdUser = await tempUserModel.createNew({
      name,
      email,
      password: hashedPassword,
    });

    const smtpServerConnected = await verifyConnection();

    if (smtpServerConnected) {
      const formattedEmail = formatEmail(
        `${process.env.BASE_API_URL}/v1/auth/verify-email?key=${createdUser.key}`,
        EmailType.VerifyEmail,
      );
      sendEmail(
        'noreply@plancraftr.com',
        createdUser.email,
        'Verify Email',
        formattedEmail as string,
      );
    }

    return { name: createdUser.name, email: createdUser.email };
  };

  return registerUser;
};

export default makeRegisterUser;
