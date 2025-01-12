import { model, Schema } from 'mongoose';
import { IUser, IUserModel } from '../../interfaces/IUserModel';
import {
  IUserDto,
  INewUserDto,
  INewOAuthUserDto,
  IUpdateUser,
} from '../../interfaces/IUserDto';
import { mapIUsertoDto } from './userMapper';
import { AppError } from '../../../../../globals/utils/AppError';
import { randomUUID } from 'crypto';

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, immutable: true },
    publicId: {
      type: String,
      default: randomUUID(),
      required: true,
      immutable: true,
    },
    authType: {
      type: String,
      enum: ['direct', 'google'],
      default: 'direct',
      required: true,
      immutable: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authType === 'direct';
      },
    },
    googleId: {
      type: String,
      required: function () {
        return this.authType === 'google';
      },
    },
    firstName: {
      type: String,
      required: function () {
        return this.authType === 'google';
      },
    },
    lastName: {
      type: String,
    },
    image: {
      type: String,
      required: function () {
        return this.authType === 'google';
      },
    },
    key: {
      type: String,
      default: '',
    },
    keyCreatedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    statics: {
      async findByEmail(email: string): Promise<IUserDto | null> {
        const user = await this.findOne({ email }).exec();

        if (user) {
          const userDto = mapIUsertoDto(user.toObject());
          return userDto;
        }

        return null;
      },

      async findByUserId(id: string): Promise<IUserDto | null> {
        const user = await this.findById(id).exec();

        if (user) {
          const userDto = mapIUsertoDto(user.toObject());
          return userDto;
        }

        return null;
      },

      async findByPublicId(publicId: string): Promise<IUserDto | null> {
        const user = await this.findOne({ publicId }).exec();

        if (user) {
          const userDto = mapIUsertoDto(user.toObject());
          return userDto;
        }

        return null;
      },

      async findByKey(key: string): Promise<IUserDto | null> {
        const user = await this.findOne({ key }).exec();

        if (user) {
          const userDto = mapIUsertoDto(user.toObject());
          return userDto;
        }

        return null;
      },

      async createNew(user: INewUserDto): Promise<IUserDto> {
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
        const mappedUser = mapIUsertoDto(newUser.toObject());
        return mappedUser;
      },

      async createNewOAuth(user: INewOAuthUserDto): Promise<IUserDto> {
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
        const mappedUser = mapIUsertoDto(newUser.toObject());
        return mappedUser;
      },

      async updateCurrent(user: IUpdateUser): Promise<IUserDto> {
        const { id, ...noId } = user;
        const updatedUser = await this.findByIdAndUpdate(id, noId, {
          new: true,
        }).exec();

        if (!updatedUser) {
          throw new AppError(
            'User does not exist',
            400,
            'User does not exist',
            true,
          );
        }

        return mapIUsertoDto(updatedUser.toObject());
      },

      async deleteCurrent(id: string): Promise<IUserDto> {
        const deletedUser = await this.findByIdAndDelete(id).exec();

        if (!deletedUser) {
          throw new AppError(
            'User does not exist',
            400,
            'User does not exist',
            true,
          );
        }

        return mapIUsertoDto(deletedUser.toObject());
      },
    },
  },
);

userSchema.pre('save', function (next) {
  if (this.isModified('key')) {
    this.keyCreatedAt = new Date();
  }
  next();
});

const User = model<IUser, IUserModel>('User', userSchema);

export default User;
