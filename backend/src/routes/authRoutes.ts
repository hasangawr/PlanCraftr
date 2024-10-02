import { Router } from "express";
import { authenticate, register, verify } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", authenticate);
router.get("/verify", verify);

export default router;
