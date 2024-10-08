import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  googleId: string;
  firstName: string;
  lastName: string;
  image: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  googleId: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model<IUser>("User", userSchema);

export default User;
