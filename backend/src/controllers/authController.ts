import { Request, Response } from "express";
import { registerUser, authenticateUser } from "../services/authService";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const response = await registerUser(
      req.body.name,
      req.body.email,
      req.body.password
    );

    if (response) {
      res.json(response).status(201);
    } else {
      res
        .send("User with this email already exist. Use different email")
        .status(409);
    }
  } catch (error) {
    res.send("Registration failed. Try again").status(500);
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const user = await authenticateUser(req.body.email, req.body.password);

    if (user) {
      const token = generateToken(user.id.toString());
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json(user).status(200);
    } else {
      res.send("Invalid credentials").status(401);
    }
  } catch (error) {
    res.send("Login failed. Try again").status(500);
  }
};
