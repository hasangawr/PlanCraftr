import { createFakeUser } from '../../../../../__test__/fakeData';
import { makeUserModel } from '../../data-access';
import { IUserDto } from '../../data-access/interfaces/IUserDto';
import makeVerifyResetPasswordKey from './verifyResetPasswordKey';

describe('verify reset password key', () => {
  let verifyResetPasswordKey: (key: string) => Promise<string | null>;
  let user: IUserDto;
  let spyPermUserFindByKey: jest.SpyInstance;

  beforeEach(() => {
    user = createFakeUser();
    const permUserModel = makeUserModel();
    spyPermUserFindByKey = jest.spyOn(permUserModel, 'findByKey');

    verifyResetPasswordKey = makeVerifyResetPasswordKey(permUserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return the email of the user, if a user with the given key exists', async () => {
    spyPermUserFindByKey.mockResolvedValueOnce(user);

    const userEmail = await verifyResetPasswordKey(user.key as string);

    expect(spyPermUserFindByKey).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByKey).toHaveBeenCalledWith(user.key);
    expect(userEmail).toBe(user.email);
  });

  it('Should return null, if a user with the given key does not exist', async () => {
    spyPermUserFindByKey.mockResolvedValueOnce(null);

    const userEmail = await verifyResetPasswordKey(user.key as string);

    expect(spyPermUserFindByKey).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByKey).toHaveBeenCalledWith(user.key);
    expect(userEmail).toBeNull();
  });
});
