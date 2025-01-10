import { mapIUsertoDto } from './userMapper';
import User from './userModel';
import { createFakeUser } from '../../../../../../__test__/fakeData';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../interfaces/IUserModel';

describe('User mapper', () => {
  let user1: HydratedDocument<IUser>;

  beforeEach(async () => {
    // create fake users
    user1 = new User(createFakeUser());

    await user1.save();
  });

  afterEach(async () => {
    // delete fake users
    await User.findByIdAndDelete(user1._id).exec();
  });

  describe('mapIUsertoDto', () => {
    it('Should map a user document with _id as ObjectId to a user dto with id as a string', async () => {
      const user = await User.findOne({ email: user1.email }).exec();

      if (user) {
        const userDto = mapIUsertoDto(user.toObject());

        expect(typeof user._id).toBe('object');
        expect(typeof userDto.id).toBe('string');
        expect(userDto.id).toBe(user1.id);
      }
    });
  });
});
