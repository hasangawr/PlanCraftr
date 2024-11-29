import { Router } from 'express';
import {
  //authenticate,
  logout,
  register,
  verify,
} from '../controllers/authController';
import passport from 'passport';

const router = Router();

// Direct auth routes
router.post('/register', register);
router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: process.env.FRONTEND_URL }), // *** make redirect work ***
  (req, res) => {
    res.status(200).send({ message: 'Login Successful' }); // *** make redirect work ***
  },
);
router.delete('/logout', logout);
router.get('/verify', verify);

// Google auth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  },
);

export default router;
