/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import app from '../../src/app';
import { createFakeUser, createFakeUserWithoutID } from '../fakeData';
import TempUser from '../../src/api/v1/data-access/mongoose/tempUser/tempUserModel';
import User from '../../src/api/v1/data-access/mongoose/user/userModel';
import { hashPassword, verifyPassword } from '../../src/globals/utils/password';
import { randomUUID } from 'crypto';

describe('authentication api integrations', () => {
  jest.setTimeout(8000);

  afterAll((done) => {
    done();
  });

  describe('base url', () => {
    it('Should return a welcome text', async () => {
      const response = await request(app).get('/');

      expect(response.text).toBe('Welcome to PlanCraftr!!!');
    });
  });

  // user registration
  describe('register user', () => {
    it('Should create a new user & return status 201 with user name & email when valid data are provided', async () => {
      const user = createFakeUserWithoutID();
      const response = await request(app)
        .post('/api/v1/auth/register')
        .set('Accept', 'application/json')
        .send({ name: user.name, email: user.email, password: user.password });

      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({
        name: user.name,
        email: user.email,
      });

      //user created on db?
      const tempUser = await TempUser.findByEmail(user.email);
      expect(tempUser?.name).toBe(user.name);

      await TempUser.findByIdAndDelete(tempUser?.id).exec();
    });

    describe('data validation', () => {
      const invalidData = [
        {
          name: 'a',
          email: createFakeUserWithoutID().email,
          password: createFakeUserWithoutID().password,
        },
        {
          name: createFakeUserWithoutID().name,
          email: 'abc123',
          password: createFakeUserWithoutID().password,
        },
        {
          name: createFakeUserWithoutID().name,
          email: createFakeUserWithoutID().email,
          password: 'abc',
        },
      ];

      invalidData.forEach((entry, index) => {
        it(`Should response with an 400 error if user data are invalid - ${index}`, async () => {
          const response = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .send(entry);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Invalid Data');

          //user created on db?
          const tempUser = await TempUser.findByEmail(entry.email);
          expect(tempUser).toBeNull();
        });
      });
    });

    it('Should response with an error if user is already present on the temporory collection', async () => {
      //create user on temp collection
      const tempUser = createFakeUserWithoutID();
      const createdUser = await TempUser.createNew({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .set('Accept', 'application/json')
        .send({
          name: tempUser.name,
          email: tempUser.email,
          password: tempUser.password,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User with this email already exist');

      //delete tempUser
      await TempUser.findByIdAndDelete(createdUser.id).exec();
    });
    it('Should response with an error if user is already present on the permenant collection', async () => {
      //create user on permenant collection
      const user = createFakeUserWithoutID();
      const createdUser = await User.createNew({
        name: user.name,
        email: user.email,
        password: user.password,
        key: user.key,
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .set('Accept', 'application/json')
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User with this email already exist');

      //delete user
      await User.findByIdAndDelete(createdUser.id).exec();
    });
  });

  // user verification
  describe('verify user email', () => {
    it('Should respond with a 400 error and an json error message if the key is not specified', async () => {
      const response = await request(app).get('/api/v1/auth/verify-email');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Data');
    });

    it('Should redirect user to register page with user=link-expired in the url if the key is expired', async () => {
      const user = createFakeUserWithoutID();

      const response = await request(app)
        .get('/api/v1/auth/verify-email')
        .query({ key: user.key });

      //test whether it redirects
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(
        `${process.env.FRONTEND_URL}/register?user=link-expired`,
      );
    });

    it('Should create a new permenant user, delete temporary user & redirect user to login page with user=publicId in the url, if the key is valid', async () => {
      //create user on temp collection
      const tempUser = createFakeUserWithoutID();
      const createdTempUser = await TempUser.createNew({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
      });

      const response = await request(app)
        .get('/api/v1/auth/verify-email')
        .query({ key: createdTempUser.key });

      const verifiedPermUser = await User.findOne({
        email: tempUser.email,
      }).exec();
      const tempUserAfterVerification = await TempUser.findOne({
        email: tempUser.email,
      }).exec();

      expect(verifiedPermUser?.email).toBe(tempUser.email);
      expect(tempUserAfterVerification).toBeNull();
      //test whether it redirects
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(
        `${process.env.FRONTEND_URL}/login?user=${verifiedPermUser?.publicId}`,
      );

      await User.findOneAndDelete({ email: tempUser.email }).exec();
    });
  });

  describe('authenticate user', () => {
    describe('data validations', () => {
      const invalidData = [
        {},
        { password: createFakeUserWithoutID().password },
        { email: createFakeUserWithoutID().email },
        { email: 'invalidEmail', password: createFakeUserWithoutID().password },
      ];

      invalidData.forEach((entry, index) => {
        it(`Should respond with a 400 error if data are invalid - ${index}`, async () => {
          const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send(entry);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Invalid Data');
        });
      });
    });

    describe('functionality', () => {
      it('Should respond with 401 status if user credentials are invalid', async () => {
        const user = createFakeUserWithoutID();

        const response = await request(app)
          .post('/api/v1/auth/login')
          .set('Accept', 'application/json')
          .send({ email: user.email, password: user.password });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Login Failed');
      });

      it('Should respond with 200 status if credentials are valid', async () => {
        const user = createFakeUserWithoutID();
        const hashedPassword = await hashPassword(user.password);

        await User.createNew({
          email: user.email,
          name: user.name,
          password: hashedPassword,
        });

        const response = await request(app)
          .post('/api/v1/auth/login')
          .set('Accept', 'application/json')
          .send({ email: user.email, password: user.password });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login Successful');

        await User.findOneAndDelete({ email: user.email }).exec();
      });

      it('Should set the session cookie on successful authentication', async () => {
        const user = createFakeUserWithoutID();
        const hashedPassword = await hashPassword(user.password);

        await User.createNew({
          email: user.email,
          name: user.name,
          password: hashedPassword,
        });

        const response = await request(app)
          .post('/api/v1/auth/login')
          .set('Accept', 'application/json')
          .send({ email: user.email, password: user.password });

        const cookies = response.headers[
          'set-cookie'
        ] as unknown as Array<string>;

        const sessionCookie = cookies.find((cookie) =>
          cookie.includes('connect.sid'),
        );

        expect(sessionCookie).not.toBeUndefined();

        await User.findOneAndDelete({ email: user.email }).exec();
      });
    });
  });

  describe('logout user', () => {
    it('Should send a 400 error if the user has not been logged in', async () => {
      const response = await request(app).delete('/api/v1/auth/logout');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Data');
    });

    it('Should clear the session cookie', async () => {
      //--------create & authenticate user----------------
      const user = createFakeUserWithoutID();
      const hashedPassword = await hashPassword(user.password);

      await User.createNew({
        email: user.email,
        name: user.name,
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({ email: user.email, password: user.password });

      const cookies = response.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      // check whether if there is a cookie with connect.sid={cookie_string}; pattern
      // which means the cooke is set
      const sessionCookie = cookies.find((cookie) =>
        cookie.match('connect.sid=[^;]+;'),
      );

      //console.log('sesck: ', sessionCookie);

      expect(sessionCookie).not.toBeUndefined();
      // ----------------------------------------

      const logoutResponse = await request(app)
        .delete('/api/v1/auth/logout')
        .set('cookie', sessionCookie as string);

      //console.log('res: ', logoutResponse);

      const cookiesAfterLogout = logoutResponse.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      // check whether if there is a cookie with connect.sid=; pattern
      // which means the cooke is cleared
      const sessionCookieAfterLogout = cookiesAfterLogout.find((cookie) =>
        cookie.match('connect.sid=;'),
      );

      expect(sessionCookieAfterLogout).not.toBeUndefined();

      await User.findOneAndDelete({ email: user.email }).exec();
    });
  });

  describe('user auth state verify', () => {
    it('Should respond with a 200 state if the user is authenticated', async () => {
      //--------create & authenticate user----------------
      const user = createFakeUserWithoutID();
      const hashedPassword = await hashPassword(user.password);

      await User.createNew({
        email: user.email,
        name: user.name,
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({ email: user.email, password: user.password });

      const cookies = response.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      // check whether if there is a cookie with connect.sid={cookie_string}; pattern
      // which means the cooke is set
      const sessionCookie = cookies.find((cookie) =>
        cookie.match('connect.sid=[^;]+;'),
      );

      //console.log('sesck: ', sessionCookie);

      expect(sessionCookie).not.toBeUndefined();
      // ----------------------------------------

      const verifyResponse = await request(app)
        .get('/api/v1/auth/verify')
        .set('cookie', sessionCookie as string);

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body.message).toBe('Authenticated');
    });

    it('Should respond with a 401 state if the user is not authenticated', async () => {
      //--------create & authenticate user----------------
      const user = createFakeUserWithoutID();
      const hashedPassword = await hashPassword(user.password);

      await User.createNew({
        email: user.email,
        name: user.name,
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({ email: user.email, password: user.password });

      const cookies = response.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      // check whether if there is a cookie with connect.sid={cookie_string}; pattern
      // which means the cooke is set
      const sessionCookie = cookies.find((cookie) =>
        cookie.match('connect.sid=[^;]+;'),
      );

      //console.log('sesck: ', sessionCookie);

      expect(sessionCookie).not.toBeUndefined();
      // ----------------------------------------

      // -----------logout-------------------------
      await request(app)
        .delete('/api/v1/auth/logout')
        .set('cookie', sessionCookie as string);
      // ------------------------------------------

      // -------------request with the expired session cookie--------
      const verifyResponse = await request(app)
        .get('/api/v1/auth/verify')
        .set('cookie', sessionCookie as string);

      expect(verifyResponse.status).toBe(401);
      expect(verifyResponse.body.message).toBe('Unauthorized');
    });

    // it('Should respond with a 400 error if the session cookie is not set on the request', async () => {
    //   const verifyResponse = await request(app).get('/api/v1/auth/verify');

    //   expect(verifyResponse.status).toBe(400);
    //   expect(verifyResponse.body.message).toBe('Invalid Data');
    // });
  });

  describe('check user email verify status', () => {
    it('Should respond with a 400 status if the id is not specified in the url', async () => {
      // create new user as a permenant user
      const user = createFakeUser();
      const { id, ...noId } = user;
      await User.createNew(noId);

      //call the endpoint
      const response = await request(app).get(
        `/api/v1/auth/user-email-verified`,
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Data');

      //delete the user
      await User.findOneAndDelete({ publicId: user.publicId });
    });

    it('Should respond with a 400 status if the id specified in the url is not a valid uuid', async () => {
      //call the endpoint
      const response = await request(app).get(
        `/api/v1/auth/user-email-verified?user=NOT-A-UUID`,
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Data');
    });

    it('Should respond with a 200 status if the user is verified', async () => {
      // create new user as a permenant user
      const user = createFakeUser();
      const { id, ...noId } = user;
      await User.createNew(noId);

      //call the endpoint
      const response = await request(app).get(
        `/api/v1/auth/user-email-verified?user=${user.publicId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Verified');

      //delete the user
      await User.findOneAndDelete({ publicId: user.publicId });
    });

    it('Should respond with a 400 status if the user is not verified', async () => {
      // create new user as a permenant user
      const user = createFakeUser();

      //call the endpoint
      const response = await request(app).get(
        `/api/v1/auth/user-email-verified?user=${user.publicId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Unverified');
    });
  });

  describe('handle forgot password reset link request', () => {
    it('Should respond with a 400 status if email not specified in the request body', async () => {
      const response = await request(app)
        .post(`/api/v1/auth/forgot-password`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Data');
    });

    it('Should respond with a 400 status if user with provided email does not exist on the db', async () => {
      const user = createFakeUser();

      const response = await request(app)
        .post(`/api/v1/auth/forgot-password`)
        .send({ email: user.email });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('user does not exist');
    });

    it('Should respond with a 200 status if the password reset link successfully sent', async () => {
      const user = createFakeUserWithoutID();

      await User.createNew(user);

      const response = await request(app)
        .post(`/api/v1/auth/forgot-password`)
        .send({ email: user.email });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset link sent');

      await User.findOneAndDelete({ email: user.email });
    });
  });

  describe('handle verifing forgot password reset key', () => {
    it('Should respond with a 400 status if the request does not contain key as query', async () => {
      const user = createFakeUser();

      const response = await request(app).get(`/api/v1/auth/forgot-password`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Data');
    });

    it('Should redirect user to reset password with email and key as cookies, if the key is successfully verified', async () => {
      const user = createFakeUserWithoutID();

      await User.createNew(user);

      const response = await request(app).get(
        `/api/v1/auth/forgot-password?key=${user.key}`,
      );

      //console.log('headers: ', response.headers);

      const cookies = response.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      let emailCookie;
      let keyCookie;

      cookies.forEach((cookie) => {
        if (cookie.includes('email')) {
          emailCookie = cookie;
        }
        if (cookie.includes('key')) {
          keyCookie = cookie;
        }
      });

      expect(response.status).toBe(302);
      expect(emailCookie).toMatch(/email=[^;]+;/);
      expect(keyCookie).toMatch(/key=[^;]+;/);

      await User.findOneAndDelete({ email: user.email });
    });

    it('Should redirect user to login with reset-user=expired query, if the key is not successfully verified', async () => {
      const user = createFakeUserWithoutID();

      const response = await request(app).get(
        `/api/v1/auth/forgot-password?key=${user.key}`,
      );

      expect(response.status).toBe(302);
      expect(response.header['location']).toBe(
        `${process.env.FRONTEND_URL}/login?reset-user=expired`,
      );

      await User.findOneAndDelete({ email: user.email });
    });
  });

  describe('handle forgot password reset', () => {
    it('Should update user password & respond with "200" status & "success" message if valid email, key and new password are provided', async () => {
      //-------initiate forgot password reset & get cookies--------------
      const { key, ...user } = createFakeUserWithoutID();
      const createdUser = await User.createNew(user);
      await User.updateCurrent({ id: createdUser.id, key });

      const response = await request(app).get(
        `/api/v1/auth/forgot-password?key=${key}`,
      );

      const cookies = response.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      let emailCookie;
      let keyCookie;

      cookies.forEach((cookie) => {
        if (cookie.includes('email')) {
          emailCookie = cookie;
        }
        if (cookie.includes('key')) {
          keyCookie = cookie;
        }
      });
      //-----------------------------------------------------------------

      const newPassword = 'newPassword#123';

      const resetPasswordResponse = await request(app)
        .put(`/api/v1/auth/reset-password`)
        .set('Cookie', [`${emailCookie};${keyCookie}`])
        .send({ password: newPassword });

      expect(resetPasswordResponse.status).toBe(200);
      expect(resetPasswordResponse.body.message).toBe('success');

      //check whether the password updated on db
      const updatedUser = await User.findByEmail(user.email);
      const verified = await verifyPassword(
        updatedUser?.password as string,
        newPassword,
      );
      expect(verified).toBe(true);

      //delete created user
      await User.findOneAndDelete({ email: user.email });
    });

    // TODO: How to??
    it.skip('key expiry', () => {});

    it('Should respond with a 400 status if the request does not contain new password in body or key & email as cookies', async () => {
      const user = createFakeUser();

      const newPassword = 'newPassword#123';

      const resetPasswordResponse = await request(app)
        .put(`/api/v1/auth/reset-password`)
        .set('Cookie', [`${'invalidEmailCookie'};${'invalidKeyCookie'}`])
        .send({ password: newPassword });

      expect(resetPasswordResponse.status).toBe(400);
      expect(resetPasswordResponse.body.message).toBe('Invalid Data');
    });

    it('Should respond with a 400 error if user does not exist', async () => {
      //-------initiate forgot password reset & get cookies--------------
      const user = createFakeUserWithoutID();

      await User.createNew(user);

      const response = await request(app).get(
        `/api/v1/auth/forgot-password?key=${user.key}`,
      );

      const cookies = response.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      let emailCookie;
      let keyCookie;

      cookies.forEach((cookie) => {
        if (cookie.includes('email')) {
          emailCookie = cookie;
        }
        if (cookie.includes('key')) {
          keyCookie = cookie;
        }
      });
      //-----------------------------------------------------------------

      //delete created user
      await User.findOneAndDelete({ email: user.email });

      const newPassword = 'newPassword#123';

      const resetPasswordResponse = await request(app)
        .put(`/api/v1/auth/reset-password`)
        .set('Cookie', [`${emailCookie};${keyCookie}`])
        .send({ password: newPassword });

      expect(resetPasswordResponse.status).toBe(400);
      expect(resetPasswordResponse.body.message).toBe('user does not exist');
    });

    it('Should respond with a 400 error if keys does not match', async () => {
      //-------initiate forgot password reset & get cookies--------------
      const user = createFakeUserWithoutID();

      await User.createNew(user);

      const response = await request(app).get(
        `/api/v1/auth/forgot-password?key=${user.key}`,
      );

      const cookies = response.headers[
        'set-cookie'
      ] as unknown as Array<string>;

      let emailCookie;

      cookies.forEach((cookie) => {
        if (cookie.includes('email')) {
          emailCookie = cookie;
        }
      });
      //-----------------------------------------------------------------

      const newPassword = 'newPassword#123';
      const differentKeyCookie = `key=${randomUUID()}; Path=/`;

      const resetPasswordResponse = await request(app)
        .put(`/api/v1/auth/reset-password`)
        .set('Cookie', [`${emailCookie};${differentKeyCookie}`])
        .send({ password: newPassword });

      expect(resetPasswordResponse.status).toBe(400);
      expect(resetPasswordResponse.body.message).toBe('keys does not match');

      //delete created user
      await User.findOneAndDelete({ email: user.email });
    });
  });
});
