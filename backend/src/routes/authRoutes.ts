import { Router } from "express";
import { authenticate, register, verify } from "../controllers/authController";
import passport from "passport";

const router = Router();

router.post("/register", register);
router.post("/login", authenticate);
router.get("/verify", verify);
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  },
);

export default router;
