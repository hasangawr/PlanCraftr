import { Request, Response } from "express";
import {
  registerUser,
  authenticateUser,
  verifyUser,
} from "../services/authService";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  //REMOVE
  console.log("Registration request");

  try {
    const response = await registerUser(
      req.body.name,
      req.body.email,
      req.body.password,
    );

    if (response) {
      res.json(response).status(201);
    } else {
      res
        .send("User with this email already exist. Use different email")
        .status(409);
    }
  } catch (error) {
    console.log("error: ", error);
    res.send("Registration failed. Try again").status(500);
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    //REMOVE
    console.log("Authentication request");

    const user = await authenticateUser(req.body.email, req.body.password);

    if (user) {
      const token = generateToken(user.id.toString());
      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "prod",
        sameSite: "strict",
      });
      res.json(user).status(200);
    } else {
      res.send("Invalid credentials").status(401);
    }
  } catch (error) {
    console.log(error);
    res.send("Login failed. Try again").status(500);
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    //REMOVE
    console.log("Verification request");

    const token = req.cookies.token;

    console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = verifyUser(token);
    res.status(200).json({ message: "Authenticated", user: decoded });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
