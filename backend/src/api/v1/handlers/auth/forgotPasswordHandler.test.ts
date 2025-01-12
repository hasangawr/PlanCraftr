/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import makeForgotPasswordHandler from './forgotPasswordHandler';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { IUserDto } from '../../data-access/interfaces/IUserDto';
import { createFakeUser } from '../../../../../__test__/fakeData';
import { AppError } from '../../../../globals/utils/AppError';

describe('forgot password handler', () => {
  let forgotPasswordHandler: (
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
  let createNewKeyForUser: jest.Mock;
  let sendPasswordResetLink: jest.Mock;
  let user: IUserDto;

  beforeEach(() => {
    user = createFakeUser();
    createNewKeyForUser = jest.fn();
    sendPasswordResetLink = jest.fn();
    request = getMockReq({ body: { email: user.email } });
    response = getMockRes();

    forgotPasswordHandler = makeForgotPasswordHandler(
      createNewKeyForUser,
      sendPasswordResetLink,
    );
  });

  afterEach(() => {
    response.mockClear();
    response.clearMockRes();
  });

  it('Should respond with status 200 if password reset link successfully sent', async () => {
    createNewKeyForUser.mockResolvedValueOnce(user.key);

    await forgotPasswordHandler(request, response.res, response.next);

    expect(createNewKeyForUser).toHaveBeenCalledTimes(1);
    expect(createNewKeyForUser).toHaveBeenCalledWith(request.body.email);
    expect(sendPasswordResetLink).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetLink).toHaveBeenCalledWith(
      user.key,
      request.body.email,
    );
  });

  it('Should forward any error to error handling middleware', async () => {
    createNewKeyForUser.mockRejectedValueOnce(
      new AppError(
        'user does not exist',
        400,
        'user with this public id does not exist',
        true,
      ),
    );

    await forgotPasswordHandler(request, response.res, response.next);

    expect(createNewKeyForUser).toHaveBeenCalledTimes(1);
    expect(createNewKeyForUser).toHaveBeenCalledWith(request.body.email);
    expect(sendPasswordResetLink).toHaveBeenCalledTimes(0);
    expect(response.next).toHaveBeenCalledTimes(1);
    expect(response.next).toHaveBeenCalledWith(
      new AppError(
        'user does not exist',
        400,
        'user with this public id does not exist',
        true,
      ),
    );
  });
});
