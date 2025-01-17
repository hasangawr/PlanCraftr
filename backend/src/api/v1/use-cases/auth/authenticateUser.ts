import { IMakeUserModel } from '../../data-access/interfaces/IUserDto';

const makeAuthenticateUser = (
  permUserModel: IMakeUserModel,
  verifyPassword: (
    hashedPassword: string,
    rawPassword: string,
  ) => Promise<boolean>,
) => {
  const authenticateUser = async (email: string, password: string) => {
    const user = await permUserModel.findByEmail(email);

    if (user) {
      if (await verifyPassword(user?.password as string, password)) {
        return user;
      }
    }

    return null;
  };

  return authenticateUser;
};

export default makeAuthenticateUser;
