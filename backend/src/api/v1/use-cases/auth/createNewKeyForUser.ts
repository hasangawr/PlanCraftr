import { AppError } from '../../../../globals/utils/AppError';
import { IMakeUserModel } from '../../data-access/interfaces/IUserDto';

const makeCreateNewKeyForUser = (permUserModel: IMakeUserModel) => {
  const createNewKeyForUser = async (email: string): Promise<string> => {
    const user = await permUserModel.findByEmail(email);

    if (user) {
      const key = crypto.randomUUID();
      const updatedUser = await permUserModel.updateCurrent({
        id: user.id,
        key,
      });
      return updatedUser.key as string;
    }

    throw new AppError(
      'user does not exist',
      400,
      'user with this public id does not exist',
      true,
    );
  };

  return createNewKeyForUser;
};

export default makeCreateNewKeyForUser;
