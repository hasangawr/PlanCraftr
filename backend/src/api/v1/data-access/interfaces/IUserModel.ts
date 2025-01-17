import { Model, ObjectId } from 'mongoose';
import {
  IUserDto,
  INewUserDto,
  INewOAuthUserDto,
  IUpdateUser,
} from './IUserDto';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  publicId: string;
  authType?: string;
  password: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  key: string;
  keyCreatedAt?: Date;
  createdAt?: Date;
}

export interface IUserModel extends Model<IUser> {
  findByEmail: (email: string) => Promise<IUserDto | null>;
  findByUserId: (id: string) => Promise<IUserDto | null>;
  findByPublicId(publicId: string): Promise<IUserDto | null>;
  findByKey: (key: string) => Promise<IUserDto | null>;

  createNew: (user: INewUserDto) => Promise<IUserDto>;
  createNewOAuth: (user: INewOAuthUserDto) => Promise<IUserDto>;
  updateCurrent: (user: IUpdateUser) => Promise<IUserDto>;
  deleteCurrent: (id: string) => Promise<IUserDto>;
}
