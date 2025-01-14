import { AppError } from '../../../../globals/utils/AppError';
import { IMakeUserModel } from '../../data-access/interfaces/IUserDto';
import { configDotenv } from 'dotenv';
configDotenv();

const makeForgotPasswordReset = (
  permUserModel: IMakeUserModel,
  hashPassword: (password: string) => Promise<string>,
  minutesElapsedTillNowFrom: (date: Date) => number,
) => {
  const forgotPasswordReset = async (
    email: string,
    key: string,
    newPassword: string,
  ): Promise<string | null> => {
    if (key) {
      const user = await permUserModel.findByEmail(email);

      if (!user) {
        throw new AppError(
          'user does not exist',
          400,
          'user with given email does not exist',
          true,
        );
      }

      if (user.key !== key) {
        throw new AppError(
          'keys does not match',
          400,
          'provided key does not match',
          true,
        );
      }

      if (user && user.keyCreatedAt) {
        const keyNotExpired =
          Number(process.env.PASSWORD_RESET_LINK_EXPIRATION_TIME_IN_MINUTES) >
          minutesElapsedTillNowFrom(user.keyCreatedAt);

        if (keyNotExpired) {
          const hashedPassword = await hashPassword(newPassword);
          const updatedUser = await permUserModel.updateCurrent({
            id: user.id,
            password: hashedPassword,
            key: '',
          });
          return updatedUser.publicId;
        }
      }
      return null;
    }
    throw new AppError(
      'key is invalid',
      400,
      'provided key is not valid',
      true,
    );
  };

  return forgotPasswordReset;
};

export default makeForgotPasswordReset;
