import { createFakeUser } from '../../../../../__test__/fakeData';
import { AppError } from '../../../../globals/utils/AppError';
import { EmailType } from '../../../../globals/utils/emailTemplates';
import { IUserDto } from '../../data-access/interfaces/IUserDto';
import makeSendPasswordResetLink from './sendPasswordResetLink';

describe('send password reset link', () => {
  let sendPasswordResetLink: (key: string, email: string) => void;

  let formatEmailMock: jest.Mock;
  let sendEMailMock: jest.Mock;
  let spyConsoleError: jest.SpyInstance;
  let user: IUserDto;

  beforeEach(() => {
    formatEmailMock = jest.fn();
    sendEMailMock = jest.fn();
    spyConsoleError = jest.spyOn(console, 'error');
    user = createFakeUser();

    sendPasswordResetLink = makeSendPasswordResetLink(
      formatEmailMock,
      sendEMailMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create link using the key, format email and send', async () => {
    const link = `${process.env.BASE_API_URL}/v1/auth/forgot-password?key=${user.key}`;
    formatEmailMock.mockReturnValueOnce('formatted email');

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

  it('Should throw a new AppError if any error occure while sending email', async () => {
    const newError = new Error('Email sending failed');
    sendEMailMock.mockRejectedValueOnce(newError);
    spyConsoleError.mockReturnValueOnce('');

    await expect(
      sendPasswordResetLink(user.key as string, user.email),
    ).rejects.toThrow(
      new AppError(
        'Error sending password reset email',
        500,
        'Password reset message sending failed',
        false,
      ),
    );
  });
});
