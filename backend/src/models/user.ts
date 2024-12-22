import { ObjectId, Schema, model } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  authType: string;
  password: string;
  googleId: string;
  firstName: string;
  lastName: string;
  image: string;
  key?: string;
  keyCreatedAt?: Date;
  createdAt: Date;
}

export interface ISafeUser {
  _id: ObjectId;
  name: string;
  email: string;
  authType: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  authType: {
    type: String,
    enum: ['direct', 'google'],
    default: 'direct',
    required: true,
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
    required: function () {
      return this.authType === 'google';
    },
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
    default: Date.now,
  },
});

const User = model<IUser>('User', userSchema);

export default User;
