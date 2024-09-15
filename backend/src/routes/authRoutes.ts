import { Router } from "express";
import { authenticate, register } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", authenticate);

export default router;
