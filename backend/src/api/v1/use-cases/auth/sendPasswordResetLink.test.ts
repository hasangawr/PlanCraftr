import { createFakeUser } from '../../../../../__test__/fakeData';
import { EmailType } from '../../../../globals/utils/emailTemplates';
import { IUserDto } from '../../data-access/interfaces/IUserDto';
import makeSendPasswordResetLink from './sendPasswordResetLink';

describe('send password reset link', () => {
  let sendPasswordResetLink: (key: string, email: string) => void;

  let formatEmailMock: jest.Mock;
  let verifyConnectionMock: jest.Mock;
  let sendEMailMock: jest.Mock;
  let user: IUserDto;

  beforeEach(() => {
    formatEmailMock = jest.fn();
    verifyConnectionMock = jest.fn();
    sendEMailMock = jest.fn();
    user = createFakeUser();

    sendPasswordResetLink = makeSendPasswordResetLink(
      formatEmailMock,
      verifyConnectionMock,
      sendEMailMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create link using the key, format email and send', async () => {
    const link = `${process.env.BASE_API_URL}/v1/auth/forgot-password?key=${user.key}`;
    formatEmailMock.mockReturnValueOnce('formatted email');
    verifyConnectionMock.mockResolvedValueOnce(true);

    await sendPasswordResetLink(user.key as string, user.email);

    expect(formatEmailMock).toHaveBeenCalledTimes(1);
    expect(formatEmailMock).toHaveBeenCalledWith(link, EmailType.ResetPassword);
    expect(sendEMailMock).toHaveBeenCalledTimes(1);
    expect(sendEMailMock).toHaveBeenCalledWith(
      process.env.EMAIL,
      user.email,
      'Reset Password',
      'formatted email',
    );
  });
});
