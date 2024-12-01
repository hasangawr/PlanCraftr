import { randomUUID } from 'crypto';
import { ObjectId, Schema, model } from 'mongoose';

export interface ITempUser {
  _id: ObjectId;
  name: string;
  email: string;
  authType: string;
  password: string;
  key: string;
  createdAt: Date;
}

const tempUserSchema = new Schema<ITempUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  authType: {
    type: String,
    default: 'direct',
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    default: randomUUID(),
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const TempUser = model<ITempUser>('TempUser', tempUserSchema);

export default TempUser;
