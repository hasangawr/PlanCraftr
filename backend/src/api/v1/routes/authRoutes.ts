import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  forgotPasswordHandler,
  forgotPasswordResetHandler,
  logoutHandler,
  registrationHandler,
  userAuthStatusVerifyHandler,
  userEmailVerifyStatusHandler,
  userVerificationHandler,
  verifyResetPasswordKeyHandler,
} from '../handlers';
import passport from 'passport';

const router = Router();

// Direct auth routes
router.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(70).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .max(30)
        .pattern(new RegExp(/\d/))
        .required(),
    }),
  }),
  registrationHandler,
);

router.get(
  '/verify-email',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      key: Joi.string().uuid({ version: 'uuidv4' }).required(),
    }),
  }),
  userVerificationHandler,
);

router.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  passport.authenticate('local', {
    failWithError: true,
  }),
  (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).json({ message: 'Login Successful' });
    }
  },
);

router.delete(
  '/logout',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      cookie: Joi.string().required(),
    }).unknown(),
  }),
  logoutHandler,
);

router.get('/verify', userAuthStatusVerifyHandler);

router.post(
  '/forgot-password',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
    }),
  }),
  forgotPasswordHandler,
); // initial pass the email

router.get(
  '/forgot-password',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      key: Joi.string().uuid({ version: 'uuidv4' }).required(),
    }),
  }),
  verifyResetPasswordKeyHandler,
); //link hits

// //router.get('/forgot-password-initiated', forgotPasswordInitiated);

router.put(
  '/reset-password',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      password: Joi.string()
        .min(6)
        .max(30)
        .pattern(new RegExp(/\d/))
        .required(),
    }),
    [Segments.COOKIES]: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        key: Joi.string().uuid({ version: 'uuidv4' }).required(),
      })
      .unknown(),
  }),
  forgotPasswordResetHandler,
);

router.get(
  '/user-email-verified',
  celebrate({
    [Segments.QUERY]: {
      user: Joi.string().uuid({ version: 'uuidv4' }).required(),
    },
  }),
  userEmailVerifyStatusHandler,
);

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
