/* eslint-disable @typescript-eslint/no-unused-vars */
import User from './userModel';
import {
  createFakeUser,
  createFakeUserWithoutID,
} from '../../../../../../__test__/fakeData';
import mongoose, { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { IUser } from '../../interfaces/IUserModel';

describe('User model', () => {
  let user1: HydratedDocument<IUser>;

  const notUserEmail = 'testmail@gmail.com';
  const notUserId = new mongoose.Types.ObjectId();
  const notUserKey = randomUUID();

  beforeEach(async () => {
    // create fake users
    user1 = new User(createFakeUser());

    await user1.save();
  });

  afterEach(async () => {
    // delete fake users
    await User.findByIdAndDelete(user1._id).exec();
  });

  describe('Validate Methods', () => {
    describe('findByEmail', () => {
      it('Should return the correct user when the email is provided', async () => {
        const user = await User.findByEmail(user1.email);
        expect(user?.name).toBe(user1.name);
      });

      it('Should return null if the user is not in the db', async () => {
        const user = await User.findByEmail(notUserEmail);
        expect(user).toBeNull();
      });
    });

    describe('findByUserId', () => {
      it('Should return the correct user when the id is provided', async () => {
        const user = await User.findByUserId(user1.id);
        expect(user?.email).toBe(user1.email);
      });

      it('Should return null if the user is not in the db', async () => {
        const user = await User.findByUserId(notUserId.toString());
        expect(user).toBeNull();
      });
    });

    describe('findByPublicId', () => {
      it('Should return the correct user when the id is provided', async () => {
        const user = await User.findByPublicId(user1.publicId);
        expect(user?.email).toBe(user1.email);
      });

      it('Should return null if the user is not in the db', async () => {
        const user = await User.findByPublicId(randomUUID());
        expect(user).toBeNull();
      });
    });

    describe('findByKey', () => {
      it('Should return the correct user when the key is provided', async () => {
        const user = await User.findByKey(user1.key as string);
        expect(user?.email).toBe(user1.email);
      });

      it('Should return null if the user is not in the db', async () => {
        const user = await User.findByKey(notUserKey);
        expect(user).toBeNull();
      });
    });

    describe('createNew', () => {
      it('Should create a new user in the db', async () => {
        const user2 = createFakeUserWithoutID();
        const createdUser = await User.createNew(user2);
        expect(createdUser?.email).toBe(user2.email);

        await User.findOneAndDelete({ email: user2.email }).exec();
      });

      it('Should throw an error if a user with same email already exist in the db', async () => {
        const user2 = createFakeUserWithoutID();
        user2.email = user1.email;
        await expect(User.createNew(user2)).rejects.toThrow(
          new Error('User with this email already exist'),
        );

        await User.findOneAndDelete({ email: user2.email }).exec();
      });
    });

    describe('updateCurrent', () => {
      it('Should update a user in the db - 1', async () => {
        const user2 = createFakeUserWithoutID();
        const updatedUser = await User.updateCurrent({
          id: user1.id,
          ...user2,
        });

        expect(updatedUser?.id).toBe(user1.id);
        expect(updatedUser?.name).toBe(user2.name);
        expect(updatedUser?.password).toBe(user2.password);

        await User.findByIdAndDelete(updatedUser?.id).exec();
      });

      it('Should update a user in the db - 2', async () => {
        const user2 = createFakeUserWithoutID();
        const updatedUser = await User.updateCurrent({
          id: user1.id,
          name: user2.name,
        });

        expect(updatedUser?.id).toBe(user1.id);
        expect(updatedUser?.name).toBe(user2.name);
        expect(updatedUser?.password).toBe(user1.password);

        await User.findByIdAndDelete(updatedUser?.id).exec();
      });

      it('Should update the keyCreatedTime if the key is updated', async () => {
        //----------
        const { key, ...user0 } = createFakeUser();
        const userWithoutKey = new User(user0);
        await userWithoutKey.save();
        const findUser0 = await User.findByEmail(user0.email);

        //----------
        const wait = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        const user2 = createFakeUserWithoutID();
        const user3 = createFakeUserWithoutID();

        if (findUser0) {
          const updatedUser = await User.updateCurrent({
            id: findUser0.id,
            key: user2.key,
          });
          await wait(5000);
          const updatedUser2 = await User.updateCurrent({
            id: findUser0.id,
            key: user3.key,
          });

          expect(updatedUser?.id).toBe(findUser0.id);
          expect(updatedUser?.name).toBe(findUser0.name);
          expect(updatedUser?.password).toBe(findUser0.password);
          expect(updatedUser?.key).toBe(user2.key);
          expect(updatedUser2?.keyCreatedAt).not.toBe(
            updatedUser?.keyCreatedAt,
          );

          await User.findByIdAndDelete(updatedUser?.id).exec();
        }
      }, 8000);

      it.skip('Should only update an user with authType = direct', async () => {});

      it('Should throw an error if user does not exist on the db', async () => {
        const user2 = createFakeUser();
        await expect(User.updateCurrent(user2)).rejects.toThrow(
          new Error('User does not exist'),
        );
      });
    });

    describe('deleteCurrent', () => {
      it('Should delete a user in the db', async () => {
        const deletedUser = await User.deleteCurrent(user1.id);

        const userExist = await User.findById(user1.id);

        expect(deletedUser.id).toBe(user1.id);
        expect(userExist).toBeNull();
      });
      it('Should throw an error if user does not exist on the db', async () => {
        const user2 = createFakeUser();
        await expect(User.deleteCurrent(user2.id)).rejects.toThrow(
          new Error('User does not exist'),
        );
      });
    });
  });
});
