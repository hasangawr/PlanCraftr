import { AppError } from '../../../../globals/utils/AppError';
import { IMakeTempUserModel } from '../../data-access/interfaces/ITempUserDto';
import { IMakeUserModel } from '../../data-access/interfaces/IUserDto';

const makeVerifyUser = (
  tempUserModel: IMakeTempUserModel,
  permUserModel: IMakeUserModel,
) => {
  const verifyUser = async (
    key: string,
  ): Promise<{ name: string; email: string; publicId: string }> => {
    const tempUser = await tempUserModel.findByKey(key);

    if (tempUser) {
      const permUser = await permUserModel.createNew({
        name: tempUser?.name as string,
        email: tempUser?.email as string,
        password: tempUser?.password as string,
      });

      await tempUserModel.deleteCurrent(tempUser.id);

      return {
        name: permUser.name,
        email: permUser.email,
        publicId: permUser.publicId,
      };
    }
    throw new AppError(
      'key expired',
      400,
      'User verification key has expired or invalid key',
      true,
    );
  };
  return verifyUser;
};

export default makeVerifyUser;
