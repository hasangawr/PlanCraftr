import User from "../models/user";
import argon2 from "argon2";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    const hash = await argon2.hash(password);

    const newUser = new User({
      name,
      email,
      password: hash,
    });

    await newUser.save();

    return { name, email };
  }

  return null;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (user) {
    const passwordVerified = await argon2.verify(
      user.password as string,
      password
    );
    if (passwordVerified) return { id: user._id, name: user.name, email };
  }
  return null;
};
