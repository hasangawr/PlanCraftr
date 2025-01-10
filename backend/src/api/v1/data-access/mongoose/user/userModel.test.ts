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
        expect(async () => {
          await User.createNew(user2);
        }).rejects.toThrow(new Error('User with this email already exist'));

        await User.findOneAndDelete({ email: user2.email }).exec();
      });
    });

    describe('updateCurrent', () => {
      it('Should update a user in the db', async () => {
        const user2 = createFakeUserWithoutID();
        const currentUser = await User.updateCurrent({
          id: user1.id,
          ...user2,
        });
        const updatedUser = await User.findById(user1.id).exec();

        expect(currentUser?.id).toBe(user1.id);
        expect(currentUser?.email).toBe(user1.email);
        expect(currentUser?.name).toBe(user1.name);
        expect(currentUser?.password).toBe(user1.password);

        expect(updatedUser?.id).toBe(user1.id);
        expect(updatedUser?.email).toBe(user2.email);
        expect(updatedUser?.name).toBe(user2.name);
        expect(updatedUser?.password).toBe(user2.password);

        await User.findByIdAndDelete(updatedUser?.id).exec();
      });

      it.skip('Should only update an user with authType = direct', async () => {});

      it('Should throw an error if user does not exist on the db', async () => {
        const user2 = createFakeUser();
        expect(async () => {
          await User.updateCurrent(user2);
        }).rejects.toThrow(new Error('User does not exist'));
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
        expect(async () => {
          await User.deleteCurrent(user2.id);
        }).rejects.toThrow(new Error('User does not exist'));
      });
    });
  });
});
