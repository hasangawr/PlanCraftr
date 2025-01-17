import {
  createFakeUser,
  createFakeUserWithoutID,
} from '../../../../../__test__/fakeData';
//import { EmailType } from '../../../../globals/utils/emailTemplates';
import { makeTempUserModel, makeUserModel } from '../../data-access';
import { ITempUserDto } from '../../data-access/interfaces/ITempUserDto';
import makeRegisterUser from './registerUser';
import { EmailType } from '../../../../globals/utils/emailTemplates';

describe('registerUser', () => {
  // temporary user: email not verified yet
  // permenant user: email verified

  let tempUser: ITempUserDto;

  let registerUser: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ name: string; email: string }>;

  let hashPasswordMock: jest.Mock;
  let formatEmailMock: jest.Mock;
  let verifyConnectionMock: jest.Mock;
  let sendEmailMock: jest.Mock;
  let spyCreateNewTempUser: jest.SpyInstance;
  let spyFindPermUserByEmail: jest.SpyInstance;

  beforeEach(() => {
    tempUser = createFakeUser();

    const tempUserModel = makeTempUserModel();
    const permUserModel = makeUserModel();

    hashPasswordMock = jest.fn();
    formatEmailMock = jest.fn();
    verifyConnectionMock = jest.fn();
    sendEmailMock = jest.fn();
    spyCreateNewTempUser = jest.spyOn(tempUserModel, 'createNew');
    spyFindPermUserByEmail = jest.spyOn(permUserModel, 'findByEmail');

    registerUser = makeRegisterUser(
      tempUserModel,
      permUserModel,
      hashPasswordMock,
      formatEmailMock,
      verifyConnectionMock,
      sendEmailMock,
    );

    hashPasswordMock.mockResolvedValueOnce(`hashedPassword`);
    formatEmailMock.mockReturnValueOnce('formattedEmail');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should save the password as a hashed password', async () => {
    const user2 = createFakeUserWithoutID();

    await registerUser(user2.name, user2.email, user2.password);

    expect(hashPasswordMock).toHaveBeenCalledTimes(1);
  });

  it('Should create a new user as a temporory user, if the email not already registered', async () => {
    const user2 = createFakeUserWithoutID();

    spyCreateNewTempUser.mockResolvedValueOnce(user2);

    const newUser = await registerUser(user2.name, user2.email, user2.password);
    expect(newUser.email).toBe(user2.email);

    expect(spyCreateNewTempUser).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if the email is already registered as a permanent user', async () => {
    spyFindPermUserByEmail.mockResolvedValueOnce(tempUser);

    const user2 = createFakeUserWithoutID();
    await expect(
      registerUser(user2.name, user2.email, user2.password),
    ).rejects.toThrow(new Error('User with this email already exist'));

    expect(spyFindPermUserByEmail).toHaveBeenCalledTimes(1);
    expect(spyCreateNewTempUser).toHaveBeenCalledTimes(0);
  });

  it('Should send the verification email once the user is registered', async () => {
    spyCreateNewTempUser.mockResolvedValueOnce(tempUser);
    verifyConnectionMock.mockResolvedValueOnce(true);
    formatEmailMock.mockResolvedValueOnce('formattedEmail');

    const createdUser = await registerUser(
      tempUser.name,
      tempUser.email,
      tempUser.password,
    );
    const link = `${process.env.BASE_API_URL}/v1/auth/verify-email?key=${tempUser.key}`;

    const senderEmail = process.env.EMAIL;
    const recieverEmail = tempUser.email;
    const subject = 'Verify Email';

    expect(spyCreateNewTempUser).toHaveBeenCalledTimes(1);
    expect(createdUser.email).toBe(tempUser.email);
    expect(formatEmailMock).toHaveBeenLastCalledWith(
      link,
      EmailType.VerifyEmail,
    );
    expect(sendEmailMock).toHaveBeenLastCalledWith(
      senderEmail,
      recieverEmail,
      subject,
      'formattedEmail',
    );
  });

  it('Should return the name & email of a registered user', async () => {
    spyCreateNewTempUser.mockResolvedValueOnce(tempUser);

    const createdUser = await registerUser(
      tempUser.name,
      tempUser.email,
      tempUser.password,
    );

    expect(createdUser).toStrictEqual({
      name: tempUser.name,
      email: tempUser.email,
    });
  });
});
