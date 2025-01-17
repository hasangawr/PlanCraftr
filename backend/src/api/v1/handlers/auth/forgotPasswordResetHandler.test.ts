/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import makeForgotPasswordResetHandler from './forgotPasswordResetHandler';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { IUserDto } from '../../data-access/interfaces/IUserDto';
import { createFakeUser } from '../../../../../__test__/fakeData';
import { AppError } from '../../../../globals/utils/AppError';

describe('forgot password reset handler', () => {
  let forgotPasswordResetHandler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  let forgotPasswordReset: jest.Mock;
  let request: Request;
  let response: {
    res: Response<any, Record<string, any>>;
    next: NextFunction;
    mockClear: () => void;
    clearMockRes: () => void;
  };
  let user: IUserDto;
  let newPassword: string;

  beforeEach(() => {
    forgotPasswordReset = jest.fn();
    user = createFakeUser();
    newPassword = 'newPassword123';
    request = getMockReq({
      body: { password: newPassword },
      cookies: { email: user.email, key: user.key },
    });
    response = getMockRes();

    forgotPasswordResetHandler =
      makeForgotPasswordResetHandler(forgotPasswordReset);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should clear cookies & respond with a "200" status, "success" message if the password successfully updated', async () => {
    forgotPasswordReset.mockResolvedValueOnce(user.publicId);

    await forgotPasswordResetHandler(request, response.res, response.next);

    expect(forgotPasswordReset).toHaveBeenCalledTimes(1);
    expect(response.res.clearCookie).toHaveBeenCalledWith('key', { path: '/' });
    expect(response.res.clearCookie).toHaveBeenCalledWith('email', {
      path: '/',
    });
    expect(response.res.clearCookie).toHaveBeenCalledTimes(2);
    expect(response.res.status).toHaveBeenCalledWith(200);
    expect(response.res.status).toHaveBeenCalledTimes(1);
    expect(response.res.json).toHaveBeenCalledWith({ message: 'success' });
    expect(response.res.json).toHaveBeenCalledTimes(1);
  });

  it('Should clear cookies & respond with a "400" status, "expired" message if the forgotPasswordReset call resolved to null', async () => {
    forgotPasswordReset.mockResolvedValueOnce(null);

    await forgotPasswordResetHandler(request, response.res, response.next);

    expect(forgotPasswordReset).toHaveBeenCalledTimes(1);
    expect(response.res.clearCookie).toHaveBeenCalledWith('key', { path: '/' });
    expect(response.res.clearCookie).toHaveBeenCalledWith('email', {
      path: '/',
    });
    expect(response.res.clearCookie).toHaveBeenCalledTimes(2);
    expect(response.res.status).toHaveBeenCalledWith(400);
    expect(response.res.status).toHaveBeenCalledTimes(1);
    expect(response.res.json).toHaveBeenCalledWith({ message: 'expired' });
    expect(response.res.json).toHaveBeenCalledTimes(1);
  });

  it('Should clear cookies & forward the error to error handler if any error occurs', async () => {
    forgotPasswordReset.mockRejectedValueOnce(
      new AppError(
        'user does not exist',
        400,
        'user with given email does not exist',
        true,
      ),
    );

    await forgotPasswordResetHandler(request, response.res, response.next);

    expect(forgotPasswordReset).toHaveBeenCalledTimes(1);
    expect(response.res.clearCookie).toHaveBeenCalledWith('key', { path: '/' });
    expect(response.res.clearCookie).toHaveBeenCalledWith('email', {
      path: '/',
    });
    expect(response.res.clearCookie).toHaveBeenCalledTimes(2);
    expect(response.next).toHaveBeenCalledWith(
      new AppError(
        'user does not exist',
        400,
        'user with given email does not exist',
        true,
      ),
    );
    expect(response.next).toHaveBeenCalledTimes(1);
  });
});
