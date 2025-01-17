import { INewTempUserDto, ITempUserDto } from '../../interfaces/ITempUserDto';
import { ITempUserModel } from '../../interfaces/ITempUserModel';

const buildMakeTempUserModel = (model: ITempUserModel) => {
  const makeTempUserModel = () => {
    return {
      findByEmail: async (email: string) => {
        return await model.findByEmail(email);
      },
      findByUserId: async (id: string) => {
        return await model.findByUserId(id);
      },
      findByKey: async (key: string) => {
        return await model.findByKey(key);
      },
      createNew: async (newUser: INewTempUserDto) => {
        return await model.createNew(newUser);
      },
      updateCurrent: async (user: ITempUserDto) => {
        return await model.updateCurrent(user);
      },
      deleteCurrent: async (id: string) => {
        return await model.deleteCurrent(id);
      },
    };
  };

  return makeTempUserModel;
};

export default buildMakeTempUserModel;
