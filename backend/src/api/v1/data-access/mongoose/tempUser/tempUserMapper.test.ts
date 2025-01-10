import { mapITempUsertoDto } from './tempUserMapper';
import TempUser from './tempUserModel';
import { createFakeUser } from '../../../../../../__test__/fakeData';
import { HydratedDocument } from 'mongoose';
import { ITempUser } from '../../interfaces/ITempUserModel';

describe('Temp User mapper', () => {
  let user1: HydratedDocument<ITempUser>;

  beforeEach(async () => {
    // create fake users
    user1 = new TempUser(createFakeUser());

    await user1.save();
  });

  afterEach(async () => {
    // delete fake users
    await TempUser.findByIdAndDelete(user1._id).exec();
  });

  describe('mapITempUsertoDto', () => {
    it('Should map a temp user document with _id as ObjectId to a temp user dto with id as a string', async () => {
      const user = await TempUser.findOne({ email: user1.email }).exec();

      if (user) {
        const userDto = mapITempUsertoDto(user.toObject());

        expect(typeof user._id).toBe('object');
        expect(typeof userDto.id).toBe('string');
        expect(userDto.id).toBe(user1.id);
      }
    });
  });
});
