import {
  INewOAuthUserDto,
  INewUserDto,
  IUpdateUser,
} from '../../interfaces/IUserDto';
import { IUserModel } from '../../interfaces/IUserModel';

const buildMakeUserModel = (model: IUserModel) => {
  const makeUserModel = () => {
    return {
      findByEmail: async (email: string) => {
        return await model.findByEmail(email);
      },
      findByUserId: async (id: string) => {
        return await model.findByUserId(id);
      },
      findByPublicId: async (publicId: string) => {
        return await model.findByPublicId(publicId);
      },
      findByKey: async (key: string) => {
        return await model.findByKey(key);
      },
      createNew: async (newUser: INewUserDto) => {
        return await model.createNew(newUser);
      },
      createNewOAuth: async (newUser: INewOAuthUserDto) => {
        return await model.createNewOAuth(newUser);
      },
      updateCurrent: async (user: IUpdateUser) => {
        return await model.updateCurrent(user);
      },
      deleteCurrent: async (id: string) => {
        return await model.deleteCurrent(id);
      },
    };
  };

  return makeUserModel;
};

export default buildMakeUserModel;
