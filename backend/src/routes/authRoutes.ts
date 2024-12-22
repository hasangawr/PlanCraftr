import { Router } from 'express';
import {
  checkUserEmailVerified,
  forgotPassword,
  forgotPasswordVerify,
  //authenticate,
  logout,
  register,
  resetPassword,
  verify,
  verifyEmail,
} from '../controllers/authController';
import passport from 'passport';

const router = Router();

// Direct auth routes
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: process.env.FRONTEND_URL,
    failWithError: false,
  }),
  (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).send({ message: 'Login Successful' });
    }

    return res.status(401).send({ message: 'Login Failed' });
  },
);
router.delete('/logout', logout);
router.get('/verify', verify);
router.get('/forgot-password', forgotPasswordVerify);
router.post('/forgot-password', forgotPassword);
//router.get('/forgot-password-initiated', forgotPasswordInitiated);
router.put('/reset-password', resetPassword);
router.get('/user-email-verified', checkUserEmailVerified);

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
