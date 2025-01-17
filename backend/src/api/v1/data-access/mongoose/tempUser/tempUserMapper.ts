import mapObject from '../../../../../globals/utils/mapper';
import { ITempUserDto } from '../../interfaces/ITempUserDto';
import { ITempUser } from '../../interfaces/ITempUserModel';

export const mapITempUsertoDto = (userDoc: ITempUser): ITempUserDto => {
  return mapObject(userDoc, (userDoc: ITempUser) => {
    const user = userDoc;
    const { _id, ...no_id } = user;
    const convertedId = String(_id);
    return { id: convertedId, ...no_id };
  });
};
