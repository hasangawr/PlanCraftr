import mapObject from '../../../../../globals/utils/mapper';
import { IUserDto } from '../../interfaces/IUserDto';
import { IUser } from '../../interfaces/IUserModel';

export const mapIUsertoDto = (userDoc: IUser): IUserDto => {
  return mapObject(userDoc, (userDoc: IUser) => {
    const user = userDoc;
    const { _id, ...no_id } = user;
    const convertedId = String(_id);
    return { id: convertedId, ...no_id };
  });
};
