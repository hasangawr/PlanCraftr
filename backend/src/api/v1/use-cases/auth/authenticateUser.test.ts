import { createFakeUser } from '../../../../../__test__/fakeData';
import { makeUserModel } from '../../data-access';
import {
  IMakeUserModel,
  IUserDto,
} from '../../data-access/interfaces/IUserDto';
import makeAuthenticateUser from './authenticateUser';

describe('authenticate user', () => {
  let user: IUserDto;
  let permUserModel: IMakeUserModel;
  let spyPermUserFindByEmail: jest.SpyInstance;
  let verifyPassword: jest.Mock;
  let authenticateUser: (
    email: string,
    password: string,
  ) => Promise<IUserDto | null>;

  beforeEach(() => {
    user = createFakeUser();
    permUserModel = makeUserModel();
    verifyPassword = jest.fn();
    authenticateUser = makeAuthenticateUser(permUserModel, verifyPassword);
    spyPermUserFindByEmail = jest.spyOn(permUserModel, 'findByEmail');
  });

  it('Should take email, password and return authenticated user if email & password are valid', async () => {
    spyPermUserFindByEmail.mockResolvedValueOnce(user);

    verifyPassword.mockResolvedValueOnce(true);

    const authenticatedUser = await authenticateUser(user.email, user.password);

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(verifyPassword).toHaveBeenCalledTimes(1);
    expect(verifyPassword).toHaveBeenCalledWith(user.password, user.password);
    expect(authenticatedUser?.email).toBe(user.email);
  });

  it('Should take email, password and return null if user with given email does not exist', async () => {
    spyPermUserFindByEmail.mockResolvedValueOnce(null);

    const authenticatedUser = await authenticateUser(user.email, user.password);

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(verifyPassword).toHaveBeenCalledTimes(0);
    expect(authenticatedUser).toBeNull();
  });

  it('Should take email, password and return null if password is invalid', async () => {
    spyPermUserFindByEmail.mockResolvedValueOnce(user);

    verifyPassword.mockResolvedValueOnce(false);

    const authenticatedUser = await authenticateUser(user.email, user.password);

    expect(spyPermUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyPermUserFindByEmail).toHaveBeenCalledWith(user.email);
    expect(verifyPassword).toHaveBeenCalledTimes(1);
    expect(verifyPassword).toHaveBeenCalledWith(user.password, user.password);
    expect(authenticatedUser).toBeNull();
  });
});
