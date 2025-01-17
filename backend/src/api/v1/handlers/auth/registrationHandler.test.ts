/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { createFakeUserWithoutID } from '../../../../../__test__/fakeData';
import { INewUserDto } from '../../data-access/interfaces/IUserDto';
import makeRegistrationHandler from './registrationHandler';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { AppError } from '../../../../globals/utils/AppError';

describe('Register a user', () => {
  let registrationHandler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  let userData: INewUserDto;

  let registerUserMock: jest.Mock;
  let request: Request;
  let response: {
    res: Response<any, Record<string, any>>;
    next: NextFunction;
    mockClear: () => void;
    clearMockRes: () => void;
  };

  beforeEach(() => {
    userData = createFakeUserWithoutID();

    registerUserMock = jest.fn();
    request = getMockReq({
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      },
    });
    response = getMockRes();

    registrationHandler = makeRegistrationHandler(registerUserMock);
  });

  afterEach(() => {
    response.mockClear();
    jest.resetAllMocks();
  });

  describe('data validations', () => {
    it('Should call registerUser once user data are provided in the request body', async () => {
      await registrationHandler(request, response.res, response.next);

      expect(registerUserMock).toHaveBeenCalledTimes(1);
      expect(registerUserMock).toHaveBeenCalledWith(
        request.body.name,
        request.body.email,
        request.body.password,
      );
    });

    it('Should return status 201 if once user data are provided in the request body', async () => {
      registerUserMock.mockResolvedValueOnce({
        name: userData.name,
        email: userData.email,
      });

      await registrationHandler(request, response.res, response.next);

      expect(response.res.status).toHaveBeenCalledTimes(1);
      expect(response.res.status).toHaveBeenCalledWith(201);
    });

    it('Should return user name and email as json once user data are provided in the request body', async () => {
      registerUserMock.mockResolvedValueOnce({
        name: userData.name,
        email: userData.email,
      });

      await registrationHandler(request, response.res, response.next);

      expect(response.res.json).toHaveBeenCalledTimes(1);
      expect(response.res.json).toHaveBeenCalledWith({
        name: request.body.name,
        email: request.body.email,
      });
    });
  });

  describe('Handle errors', () => {
    it('Should forward the error to error handler if register user call throws error, when user already exist', async () => {
      const error = new AppError(
        'User with this email already exist',
        400,
        'User with this email already exist',
        true,
      );
      registerUserMock.mockRejectedValueOnce(error);

      await registrationHandler(request, response.res, response.next);

      expect(response.next).toHaveBeenCalledTimes(1);
      expect(response.next).toHaveBeenCalledWith(error);
    });

    describe('When unhandled exception occurs', () => {
      const errorMessages = [
        'Server error',
        'Server failure',
        'Unexpected condition encountered',
        'Service is temporarily unavailable',
      ];

      errorMessages.forEach(async (errorMsg) => {
        it('Should forward the error to the errorhandler', async () => {
          const error = new Error(errorMsg);
          registerUserMock.mockRejectedValueOnce(error);

          await registrationHandler(request, response.res, response.next);

          expect(response.next).toHaveBeenCalledTimes(1);
          expect(response.next).toHaveBeenCalledWith(error);
        });
      });
    });
  });
});
