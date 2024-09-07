import jwt from "jsonwebtoken";
require("dotenv").config();

const secret = process.env.JWT_SECRET;

if (!secret) throw new Error("JWT_SECRET is not defined");

export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
};

export const validateToken = (
  token: string
): jwt.JwtPayload | string | null => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
};
