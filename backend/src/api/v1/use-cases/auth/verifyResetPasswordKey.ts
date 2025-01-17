import { IMakeUserModel } from '../../data-access/interfaces/IUserDto';

const makeVerifyResetPasswordKey = (permUserModel: IMakeUserModel) => {
  const verifyResetPasswordKey = async (
    key: string,
  ): Promise<string | null> => {
    const user = await permUserModel.findByKey(key);
    if (user) {
      return user.email;
    }
    return null;
  };

  return verifyResetPasswordKey;
};

export default makeVerifyResetPasswordKey;
