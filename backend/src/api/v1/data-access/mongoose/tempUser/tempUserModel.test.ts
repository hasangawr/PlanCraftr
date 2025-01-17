import TempUser from './tempUserModel';
import {
  createFakeUser,
  createFakeUserWithoutID,
} from '../../../../../../__test__/fakeData';
import mongoose, { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { ITempUser } from '../../interfaces/ITempUserModel';

describe('Temp User model', () => {
  let user1: HydratedDocument<ITempUser>;

  const notUserEmail = 'testmail@gmail.com';
  const notUserId = new mongoose.Types.ObjectId();
  const notUserKey = randomUUID();

  beforeEach(async () => {
    // create fake users
    user1 = new TempUser(createFakeUser());

    await user1.save();
  });

  afterEach(async () => {
    // delete fake users
    await TempUser.findByIdAndDelete(user1._id).exec();
  });

  describe('Validate temp user expiry', () => {
    it('Should delete temp user after the set ttl from the creation', async () => {
      const user2 = new TempUser(createFakeUser());
      await user2.save();

      const userCreated = await TempUser.findById(user2.id).exec();
      expect(userCreated?.email).toBe(user2.email);

      setTimeout(async () => {
        const userExist = await TempUser.findById(user2.id).exec();
        expect(userExist).toBeNull();
      }, 10000).unref();
    });
  });

  describe('Validate Methods', () => {
    describe('findByEmail', () => {
      it('Should return the correct user when the email is provided', async () => {
        const user = await TempUser.findByEmail(user1.email);
        expect(user?.name).toBe(user1.name);
      });

      it('Should return null if the user is not in the db', async () => {
        const user = await TempUser.findByEmail(notUserEmail);
        expect(user).toBeNull();
      });
    });

    describe('findByUserId', () => {
      it('Should return the correct user when the id is provided', async () => {
        const user = await TempUser.findByUserId(user1.id);
        expect(user?.email).toBe(user1.email);
      });

      it('Should return null if the user is not in the db', async () => {
        const user = await TempUser.findByUserId(notUserId.toString());
        expect(user).toBeNull();
      });
    });

    describe('findByKey', () => {
      it('Should return the correct user when the key is provided', async () => {
        const user = await TempUser.findByKey(user1.key as string);
        expect(user?.email).toBe(user1.email);
      });

      it('Should return null if the user is not in the db', async () => {
        const user = await TempUser.findByKey(notUserKey);
        expect(user).toBeNull();
      });
    });

    describe('createNew', () => {
      it('Should create a new user in the db', async () => {
        const user2 = createFakeUserWithoutID();
        const createdUser = await TempUser.createNew(user2);
        expect(createdUser?.email).toBe(user2.email);

        await TempUser.findOneAndDelete({ email: user2.email }).exec();
      });

      it('Should throw an error if a user with same email already exist in the db', async () => {
        const user2 = createFakeUserWithoutID();
        user2.email = user1.email;
        await expect(TempUser.createNew(user2)).rejects.toThrow(
          new Error('User with this email already exist'),
        );

        await TempUser.findOneAndDelete({ email: user2.email }).exec();
      });
    });

    describe('updateCurrent', () => {
      it('Should update a user in the db', async () => {
        const user2 = createFakeUserWithoutID();
        const currentUser = await TempUser.updateCurrent({
          id: user1.id,
          ...user2,
        });
        const updatedUser = await TempUser.findById(user1.id).exec();

        expect(currentUser?.id).toBe(user1.id);
        expect(currentUser?.email).toBe(user1.email);
        expect(currentUser?.name).toBe(user1.name);
        expect(currentUser?.password).toBe(user1.password);

        expect(updatedUser?.id).toBe(user1.id);
        expect(updatedUser?.email).toBe(user2.email);
        expect(updatedUser?.name).toBe(user2.name);
        expect(updatedUser?.password).toBe(user2.password);

        await TempUser.findByIdAndDelete(updatedUser?.id).exec();
      });
      it('Should throw an error if user does not exist on the db', async () => {
        const user2 = createFakeUser();
        await expect(TempUser.updateCurrent(user2)).rejects.toThrow(
          new Error('User does not exist'),
        );
      });
    });

    describe('deleteCurrent', () => {
      it('Should delete a user in the db', async () => {
        const deletedUser = await TempUser.deleteCurrent(user1.id);

        const userExist = await TempUser.findById(user1.id);

        expect(deletedUser.id).toBe(user1.id);
        expect(userExist).toBeNull();
      });
      it('Should throw an error if user does not exist on the db', async () => {
        const user2 = createFakeUser();
        await expect(TempUser.deleteCurrent(user2.id)).rejects.toThrow(
          new Error('User does not exist'),
        );
      });
    });
  });
});
