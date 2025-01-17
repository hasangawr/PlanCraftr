import { model, Schema } from 'mongoose';
import { ITempUser, ITempUserModel } from '../../interfaces/ITempUserModel';
import { ITempUserDto, INewTempUserDto } from '../../interfaces/ITempUserDto';
import { mapITempUsertoDto } from './tempUserMapper';
import { randomUUID } from 'crypto';
import { AppError } from '../../../../../globals/utils/AppError';

const tempUserSchema = new Schema<ITempUser, ITempUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    authType: {
      type: String,
      default: 'direct',
    },
    password: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      default: () => randomUUID(),
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: process.env.NODE_ENV === 'test' ? 10 : 600,
    },
  },
  {
    statics: {
      async findByEmail(email: string): Promise<ITempUserDto | null> {
        const user = await this.findOne({ email }).exec();

        if (user) {
          const userDto = mapITempUsertoDto(user.toObject());
          return userDto;
        }

        return null;
      },

      async findByUserId(id: string): Promise<ITempUserDto | null> {
        const user = await this.findById(id).exec();

        if (user) {
          const userDto = mapITempUsertoDto(user.toObject());
          return userDto;
        }

        return null;
      },

      async findByKey(key: string): Promise<ITempUserDto | null> {
        const user = await this.findOne({ key }).exec();

        if (user) {
          const userDto = mapITempUsertoDto(user.toObject());
          return userDto;
        }

        return null;
      },

      async createNew(user: INewTempUserDto): Promise<ITempUserDto> {
        const currentUser = await this.findOne({ email: user.email }).exec();

        if (currentUser) {
          throw new AppError(
            'User with this email already exist',
            400,
            'User with this email already exist',
            true,
          );
        }

        const newUser = new this(user);
        await newUser.save();
        const mappedUser = mapITempUsertoDto(newUser.toObject());
        return mappedUser;
      },

      async updateCurrent(user: ITempUserDto): Promise<ITempUserDto> {
        const { id, ...noId } = user;
        const currentUser = await this.findByIdAndUpdate(id, noId).exec();

        if (!currentUser) {
          throw new AppError(
            'User does not exist',
            400,
            'User does not exist',
            true,
          );
        }

        return mapITempUsertoDto(currentUser.toObject());
      },

      async deleteCurrent(id: string): Promise<ITempUserDto> {
        const deletedUser = await this.findByIdAndDelete(id).exec();

        if (!deletedUser) {
          throw new AppError(
            'User does not exist',
            400,
            'User does not exist',
            true,
          );
        }

        return mapITempUsertoDto(deletedUser.toObject());
      },
    },
  },
);

const TempUser = model<ITempUser, ITempUserModel>('TempUser', tempUserSchema);

export default TempUser;
