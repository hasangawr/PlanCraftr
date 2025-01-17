/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { createFakeUser } from '../../../../../__test__/fakeData';
import { IUserDto } from '../../data-access/interfaces/IUserDto';
import { getMockReq, getMockRes } from '@jest-mock/express';
import makeUserEmailVerifyStatusHandler from './userEmailVerifyStatusHandler';
import { AppError } from '../../../../globals/utils/AppError';

describe('user email verification status handler', () => {
  let user: IUserDto;
  let request: Request;
  let response: {
    res: Response<any, Record<string, any>>;
    next: NextFunction;
    mockClear: () => void;
    clearMockRes: () => void;
  };
  let userEmailVerifyStatusHandler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  let checkUserEmailVerified: jest.Mock;

  beforeEach(() => {
    user = createFakeUser();

    request = getMockReq({ query: { user: user.publicId } });
    response = getMockRes();

    checkUserEmailVerified = jest.fn();

    userEmailVerifyStatusHandler = makeUserEmailVerifyStatusHandler(
      checkUserEmailVerified,
    );
  });

  afterEach(() => {
    response.mockClear();
    response.clearMockRes();
  });

  it('Should respond with a 200 status if the user is verified', async () => {
    checkUserEmailVerified.mockResolvedValueOnce(true);

    await userEmailVerifyStatusHandler(request, response.res, response.next);

    expect(checkUserEmailVerified).toHaveBeenCalledTimes(1);
    expect(checkUserEmailVerified).toHaveBeenCalledWith(user.publicId);
    expect(response.res.status).toHaveBeenCalledTimes(1);
    expect(response.res.status).toHaveBeenCalledWith(200);
    expect(response.res.json).toHaveBeenCalledTimes(1);
    expect(response.res.json).toHaveBeenCalledWith({ message: 'Verified' });
  });

  it('Should respond with an Unverified message if the user not verified', async () => {
    checkUserEmailVerified.mockResolvedValueOnce(false);

    await userEmailVerifyStatusHandler(request, response.res, response.next);

    expect(checkUserEmailVerified).toHaveBeenCalledTimes(1);
    expect(checkUserEmailVerified).toHaveBeenCalledWith(user.publicId);
    expect(response.res.json).toHaveBeenCalledTimes(1);
    expect(response.res.json).toHaveBeenCalledWith({ message: 'Unverified' });
  });

  it('Should forward any errors that are thrown to the error handler middleware', async () => {
    checkUserEmailVerified.mockRejectedValueOnce(
      new AppError(
        'Error accessing db',
        500,
        'error occured while retrieving user by public id',
        false,
      ),
    );

    await userEmailVerifyStatusHandler(request, response.res, response.next);

    expect(response.next).toHaveBeenCalledTimes(1);
    expect(response.next).toHaveBeenCalledWith(
      new AppError(
        'Error accessing db',
        500,
        'error occured while retrieving user by public id',
        false,
      ),
    );
  });
});
