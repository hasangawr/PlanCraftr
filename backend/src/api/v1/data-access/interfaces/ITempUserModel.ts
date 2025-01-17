import { Model, ObjectId } from 'mongoose';
import { ITempUserDto, INewTempUserDto } from './ITempUserDto';

export interface ITempUser {
  _id: ObjectId;
  name: string;
  email: string;
  authType?: string;
  password: string;
  key: string;
  createdAt?: Date;
}

export interface ITempUserModel extends Model<ITempUser> {
  findByEmail: (email: string) => Promise<ITempUserDto | null>;
  findByUserId: (id: string) => Promise<ITempUserDto | null>;
  findByKey: (key: string) => Promise<ITempUserDto | null>;

  createNew: (user: INewTempUserDto) => Promise<ITempUserDto>;
  updateCurrent: (user: ITempUserDto) => Promise<ITempUserDto>;
  deleteCurrent: (id: string) => Promise<ITempUserDto>;
}
