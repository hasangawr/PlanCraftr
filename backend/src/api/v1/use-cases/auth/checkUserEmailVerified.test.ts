import { createFakeUser } from '../../../../../__test__/fakeData';
import { makeUserModel } from '../../data-access';
import {
  IMakeUserModel,
  IUserDto,
} from '../../data-access/interfaces/IUserDto';
import makeCheckUserEmailVerified from './checkUserEmailVerified';

describe('check user email verified', () => {
  let checkUserEmailVerified: (publicId: string) => Promise<boolean>;
  let permUserModel: IMakeUserModel;
  let spyPermUserFindByPublicId: jest.SpyInstance;
  let user: IUserDto;

  beforeEach(() => {
    permUserModel = makeUserModel();
    spyPermUserFindByPublicId = jest.spyOn(permUserModel, 'findByPublicId');

    user = createFakeUser();

    checkUserEmailVerified = makeCheckUserEmailVerified(permUserModel);
  });

  it('Should return true if user is a permenant user', async () => {
    spyPermUserFindByPublicId.mockResolvedValueOnce(user);

    const output = await checkUserEmailVerified(user.publicId);

    expect(spyPermUserFindByPublicId).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByPublicId).toHaveBeenCalledWith(user.publicId);
    expect(output).toBe(true);
  });

  it('Should return false if user is not a permenant user', async () => {
    spyPermUserFindByPublicId.mockResolvedValueOnce(null);

    const output = await checkUserEmailVerified(user.publicId);

    expect(spyPermUserFindByPublicId).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByPublicId).toHaveBeenCalledWith(user.publicId);
    expect(output).toBe(false);
  });
});
