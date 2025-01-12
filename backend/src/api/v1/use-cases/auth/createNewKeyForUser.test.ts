/* eslint-disable @typescript-eslint/no-unused-vars */
import { createFakeUser } from '../../../../../__test__/fakeData';
import { AppError } from '../../../../globals/utils/AppError';
import { makeUserModel } from '../../data-access';
import {
  IMakeUserModel,
  IUserDto,
} from '../../data-access/interfaces/IUserDto';
import makeCreateNewKeyForUser from './createNewKeyForUser';

describe('create new key for a user', () => {
  let user: IUserDto;
  let permUserModel: IMakeUserModel;
  let spyPermUserFindByEmail: jest.SpyInstance;
  let spyPermUserUpdateCurrent: jest.SpyInstance;
  let spyRandomUUIDGenerator: jest.SpyInstance;
  let createNewKeyForUser: (publicId: string) => Promise<string>;

  beforeEach(() => {
    user = createFakeUser();
    permUserModel = makeUserModel();
    spyPermUserFindByEmail = jest.spyOn(permUserModel, 'findByEmail');
    spyPermUserUpdateCurrent = jest.spyOn(permUserModel, 'updateCurrent');
    spyRandomUUIDGenerator = jest.spyOn(crypto, 'randomUUID');
    createNewKeyForUser = makeCreateNewKeyForUser(permUserModel);
  });

  it('Should create, save & return a new key for the user with given publicId, if the user exist', async () => {
    const { key, ...userDataWithoutKey } = user;
    const newKey = crypto.randomUUID();

    spyPermUserFindByEmail.mockResolvedValueOnce(user);
    spyRandomUUIDGenerator.mockReturnValueOnce(newKey);
    spyPermUserUpdateCurrent.mockResolvedValueOnce({
      ...userDataWithoutKey,
      key: newKey,
    });

    const createdKey = await createNewKeyForUser(user.email);

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(spyRandomUUIDGenerator).toHaveBeenCalledTimes(2);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledTimes(1);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledWith({
      id: user.id,
      key: newKey,
    });
    expect(createdKey).toBe(newKey);
  });

  it('Should throw an error if the user does not exist', async () => {
    spyPermUserFindByEmail.mockResolvedValueOnce(null);

    await expect(createNewKeyForUser(user.email)).rejects.toThrow(
      new AppError(
        'user does not exist',
        400,
        'user with this public id does not exist',
        true,
      ),
    );

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(spyRandomUUIDGenerator).toHaveBeenCalledTimes(0);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledTimes(0);
  });
});
