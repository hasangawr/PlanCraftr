import { createFakeUserWithoutID } from '../../../../../__test__/fakeData';
import { AppError } from '../../../../globals/utils/AppError';
import { makeTempUserModel, makeUserModel } from '../../data-access';
import { INewUserDto } from '../../data-access/interfaces/IUserDto';
import makeVerifyUser from './verifyUser';

describe('Verify User', () => {
  let tempUser: INewUserDto;
  let spyFindTempUserByKey: jest.SpyInstance;
  let spyCreateNewPermUser: jest.SpyInstance;
  let spyDeleteTempUser: jest.SpyInstance;
  let verifyUser: (key: string) => Promise<{ name: string; email: string }>;

  beforeEach(() => {
    tempUser = createFakeUserWithoutID();

    const tempUserModel = makeTempUserModel();
    const permUserModel = makeUserModel();

    spyFindTempUserByKey = jest.spyOn(tempUserModel, 'findByKey');
    spyDeleteTempUser = jest.spyOn(tempUserModel, 'deleteCurrent');
    spyCreateNewPermUser = jest.spyOn(permUserModel, 'createNew');

    verifyUser = makeVerifyUser(tempUserModel, permUserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create a new permenant user & delete the temp user if a temporary user exists for the given key', async () => {
    const permUser = { ...tempUser, keyCreatedAt: Date.now };
    const { key, ...tempUserWithoutKey } = tempUser;

    spyFindTempUserByKey.mockResolvedValueOnce(tempUser);
    spyCreateNewPermUser.mockResolvedValueOnce(permUser);
    spyDeleteTempUser.mockResolvedValueOnce(tempUser);

    const verifiedUser = await verifyUser(key as string);

    expect(spyFindTempUserByKey).toHaveBeenCalledTimes(1);
    expect(spyFindTempUserByKey).toHaveBeenCalledWith(tempUser.key);
    expect(spyCreateNewPermUser).toHaveBeenCalledTimes(1);
    expect(spyCreateNewPermUser).toHaveBeenCalledWith(tempUserWithoutKey);
    expect(verifiedUser.email).toBe(tempUser.email);
    expect(spyDeleteTempUser).toHaveBeenCalledTimes(1);
    expect(spyDeleteTempUser).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if a temporary user does not exist for the given key', async () => {
    const expiredKey = createFakeUserWithoutID().key;

    spyFindTempUserByKey.mockResolvedValueOnce(null);

    await expect(verifyUser(expiredKey as string)).rejects.toThrow(
      new AppError(
        'key expired',
        400,
        'User verification key has expired or invalid key',
        true,
      ),
    );

    expect(spyFindTempUserByKey).toHaveBeenCalledTimes(1);
    expect(spyFindTempUserByKey).toHaveBeenCalledWith(expiredKey);
    expect(spyCreateNewPermUser).toHaveBeenCalledTimes(0);
  });
});
