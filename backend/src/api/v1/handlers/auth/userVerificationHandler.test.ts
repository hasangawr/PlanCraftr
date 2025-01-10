/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMockReq, getMockRes } from '@jest-mock/express';
import { createFakeUserWithoutID } from '../../../../../__test__/fakeData';
import makeUserVerificationHandler from './userVerificationHandler';
import { NextFunction, Request, Response } from 'express';
import { INewUserDto } from '../../data-access/interfaces/IUserDto';
import { AppError } from '../../../../globals/utils/AppError';

describe('User verification handler', () => {
  let verifyUser: jest.Mock;
  let userVerificationHandler: (
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
  let user: INewUserDto;

  beforeEach(() => {
    verifyUser = jest.fn();
    userVerificationHandler = makeUserVerificationHandler(verifyUser);

    user = createFakeUserWithoutID();

    request = getMockReq({ query: { key: user.key } });
    response = getMockRes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should redirect user to login if key is valid', async () => {
    verifyUser.mockResolvedValueOnce({ name: user.name, email: user.email });

    await userVerificationHandler(request, response.res, response.next);

    expect(response.res.redirect).toHaveBeenCalledTimes(1);
    expect(response.res.redirect).toHaveBeenCalledWith(
      `${process.env.FRONTEND_URL}/login?user=${user.email}`,
    );
  });

  it('Should forward the error to the error handler if verification process failed with an AppError', async () => {
    verifyUser.mockRejectedValueOnce(
      new AppError(
        'key expired',
        400,
        'User verification key has expired or invalid key',
        true,
      ),
    );

    await userVerificationHandler(request, response.res, response.next);

    expect(response.next).toHaveBeenCalledTimes(1);
    expect(response.next).toHaveBeenCalledWith(
      new AppError(
        'key expired',
        400,
        'User verification key has expired or invalid key',
        true,
      ),
    );
  });
});
