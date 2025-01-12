import { AppError } from '../../../../globals/utils/AppError';
import { IMakeUserModel } from '../../data-access/interfaces/IUserDto';

const makeCheckUserEmailVerified = (permUserModel: IMakeUserModel) => {
  const checkUserEmailVerified = async (publicId: string): Promise<boolean> => {
    try {
      const user = await permUserModel.findByPublicId(publicId);

      if (user) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new AppError(
        'Error accessing db',
        500,
        'error occured while retrieving user by public id',
        false,
      );
    }
  };

  return checkUserEmailVerified;
};

export default makeCheckUserEmailVerified;
