/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import makeVerifyResetPasswordKeyHandler from './verifyResetPasswordKeyHandler';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { createFakeUser } from '../../../../../__test__/fakeData';
import { IUserDto } from '../../data-access/interfaces/IUserDto';

describe('verify reset password key handler', () => {
  let verifyResetPasswordKey: jest.Mock;
  let verifyResetPasswordKeyHandler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  let request: Request;
  let response: {
    res: Response<any, Record<string, any>>;
    next: NextFunction;
    mockClear: () => void;
    clearMockRes: () => void;
  };
  let user: IUserDto;

  beforeEach(() => {
    verifyResetPasswordKey = jest.fn();
    user = createFakeUser();
    request = getMockReq({ query: { key: user.key } });
    response = getMockRes();

    verifyResetPasswordKeyHandler = makeVerifyResetPasswordKeyHandler(
      verifyResetPasswordKey,
    );
  });

  afterEach(() => {
    response.mockClear();
    response.clearMockRes();
    jest.clearAllMocks();
  });

  it('Should set email and key as cookies on response & redirect user to reset password screen, if user exist for given key', async () => {
    verifyResetPasswordKey.mockResolvedValueOnce(user.email);

    await verifyResetPasswordKeyHandler(request, response.res, response.next);

    expect(verifyResetPasswordKey).toHaveBeenCalledTimes(1);
    expect(verifyResetPasswordKey).toHaveBeenCalledWith(request.query.key);
    expect(response.res.cookie).toHaveBeenCalledWith('email', user.email, {
      httpOnly: false,
      secure: false,
    });
    expect(response.res.cookie).toHaveBeenCalledWith('key', request.query.key, {
      httpOnly: false,
      secure: false,
    });
    expect(response.res.cookie).toHaveBeenCalledTimes(2);
    expect(response.res.redirect).toHaveBeenCalledTimes(1);
    expect(response.res.redirect).toHaveBeenCalledWith(
      `${process.env.FRONTEND_URL}/reset-password`,
    );
  });

  it('Should not set email and key as cookies on response & redirect user to login screen with query reset-user=expired, if user does not exist for given key', async () => {
    verifyResetPasswordKey.mockResolvedValueOnce(null);

    await verifyResetPasswordKeyHandler(request, response.res, response.next);

    expect(verifyResetPasswordKey).toHaveBeenCalledTimes(1);
    expect(verifyResetPasswordKey).toHaveBeenCalledWith(request.query.key);
    expect(response.res.cookie).toHaveBeenCalledTimes(0);
    expect(response.res.redirect).toHaveBeenCalledTimes(1);
    expect(response.res.redirect).toHaveBeenCalledWith(
      `${process.env.FRONTEND_URL}/login?reset-user=expired`,
    );
  });

  it('Should forward any error to the error handling middleware', async () => {
    verifyResetPasswordKey.mockRejectedValueOnce(new Error('error'));

    await verifyResetPasswordKeyHandler(request, response.res, response.next);

    expect(verifyResetPasswordKey).toHaveBeenCalledTimes(1);
    expect(verifyResetPasswordKey).toHaveBeenCalledWith(request.query.key);
    expect(response.res.cookie).toHaveBeenCalledTimes(0);
    expect(response.next).toHaveBeenCalledTimes(1);
    expect(response.next).toHaveBeenCalledWith(new Error('error'));
  });
});
