import { createFakeUser } from '../../../../../__test__/fakeData';
import { AppError } from '../../../../globals/utils/AppError';
import { makeUserModel } from '../../data-access';
import {
  IMakeUserModel,
  IUserDto,
} from '../../data-access/interfaces/IUserDto';
import makeForgotPasswordReset from './forgotPasswordReset';

describe('forgot password reset', () => {
  let forgotPasswordReset: (
    email: string,
    key: string,
    newPassword: string,
  ) => Promise<string | null>;
  let permUserModel: IMakeUserModel;
  let spyPermUserFindByEmail: jest.SpyInstance;
  let spyPermUserUpdateCurrent: jest.SpyInstance;
  let hashPassword: jest.Mock;
  let minutesElapsedTillNowFrom: jest.Mock;
  let user: IUserDto;

  beforeEach(() => {
    permUserModel = makeUserModel();
    spyPermUserFindByEmail = jest.spyOn(permUserModel, 'findByEmail');
    spyPermUserUpdateCurrent = jest.spyOn(permUserModel, 'updateCurrent');
    hashPassword = jest.fn();
    minutesElapsedTillNowFrom = jest.fn();
    user = createFakeUser();

    forgotPasswordReset = makeForgotPasswordReset(
      permUserModel,
      hashPassword,
      minutesElapsedTillNowFrom,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should update user password, clear the key & return user publicId when valid email and key provided', async () => {
    const newPassword = 'newPassword';
    const newPasswordHashed = 'newPasswordHashed';
    const nonExpiredKeyCreatedAt = new Date(
      new Date().setMinutes(
        new Date().getMinutes() -
          Number(process.env.PASSWORD_RESET_LINK_EXPIRATION_TIME_IN_MINUTES) +
          3,
      ),
    );

    spyPermUserFindByEmail.mockResolvedValueOnce({
      ...user,
      keyCreatedAt: nonExpiredKeyCreatedAt,
    });

    const { password, key, ...userWithoutPasswordAndKey } = user;

    hashPassword.mockResolvedValueOnce(newPasswordHashed);

    minutesElapsedTillNowFrom.mockReturnValueOnce(
      Number(process.env.PASSWORD_RESET_LINK_EXPIRATION_TIME_IN_MINUTES) - 3,
    );

    spyPermUserUpdateCurrent.mockResolvedValueOnce({
      ...userWithoutPasswordAndKey,
      password: newPasswordHashed,
      key: '',
    });

    const userPublicId = await forgotPasswordReset(
      user.email,
      key as string,
      newPassword,
    );

    expect(password).toBe(password);
    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(minutesElapsedTillNowFrom).toHaveBeenCalledTimes(1);
    expect(minutesElapsedTillNowFrom).toHaveBeenCalledWith(
      nonExpiredKeyCreatedAt,
    );
    expect(hashPassword).toHaveBeenCalledTimes(1);
    expect(hashPassword).toHaveBeenCalledWith(newPassword);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledTimes(1);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledWith({
      id: user.id,
      password: newPasswordHashed,
      key: '',
    });
    expect(userPublicId).toBe(user.publicId);
  });

  it('Should return null if the key is expired', async () => {
    const newPassword = 'newPassword';
    const expiredKeyCreatedAt = new Date(
      new Date().setMinutes(
        new Date().getMinutes() -
          Number(process.env.PASSWORD_RESET_LINK_EXPIRATION_TIME_IN_MINUTES) -
          3,
      ),
    );

    spyPermUserFindByEmail.mockResolvedValueOnce({
      ...user,
      keyCreatedAt: expiredKeyCreatedAt,
    });

    const userPublicId = await forgotPasswordReset(
      user.email,
      user.key as string,
      newPassword,
    );

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(hashPassword).toHaveBeenCalledTimes(0);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledTimes(0);
    expect(userPublicId).toBeNull();
  });

  it('Should throw an AppError if the user with given email does not exist', async () => {
    const newPassword = 'newPassword';
    spyPermUserFindByEmail.mockResolvedValueOnce(null);

    await expect(
      forgotPasswordReset(user.email, user.key as string, newPassword),
    ).rejects.toThrow(
      new AppError(
        'user does not exist',
        400,
        'user with given email does not exist',
        true,
      ),
    );

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(hashPassword).toHaveBeenCalledTimes(0);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledTimes(0);
  });

  it('Should throw an AppError if the provided user key is empty', async () => {
    const newPassword = 'newPassword';
    const emptyKey = '';

    await expect(
      forgotPasswordReset(user.email, emptyKey, newPassword),
    ).rejects.toThrow(
      new AppError('key is invalid', 400, 'provided key is not valid', true),
    );

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(0);
    expect(hashPassword).toHaveBeenCalledTimes(0);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledTimes(0);
  });

  it('Should throw an AppError if the user with given email does not have the given key', async () => {
    const newPassword = 'newPassword';
    const keyProvided = 'keyProvided';
    const nonExpiredKeyCreatedAt = new Date(
      new Date().setMinutes(
        new Date().getMinutes() -
          Number(process.env.PASSWORD_RESET_LINK_EXPIRATION_TIME_IN_MINUTES) +
          3,
      ),
    );

    spyPermUserFindByEmail.mockResolvedValueOnce({
      ...user,
      keyCreatedAt: nonExpiredKeyCreatedAt,
    });

    await expect(
      forgotPasswordReset(user.email, keyProvided, newPassword),
    ).rejects.toThrow(
      new AppError(
        'keys does not match',
        400,
        'provided key does not match',
        true,
      ),
    );

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(minutesElapsedTillNowFrom).toHaveBeenCalledTimes(0);
    expect(hashPassword).toHaveBeenCalledTimes(0);
    expect(spyPermUserUpdateCurrent).toHaveBeenCalledTimes(0);
  });
});
