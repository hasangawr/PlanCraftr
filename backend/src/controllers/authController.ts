// import { Request, Response } from 'express';
// import {
//   _checkUserEmailVerified,
//   getUserByEmail,
//   getUserByKey,
//   registerUser,
//   resetUserPassword,
//   sendPasswordResetLink,
//   verifyUserEmail,
// } from '../services/authService';

// export const register = async (req: Request, res: Response) => {
//   try {
//     const response = await registerUser(
//       req.body.name,
//       req.body.email,
//       req.body.password,
//     );

//     if (response) {
//       res.status(201).json(response);
//     } else {
//       res.send({
//         message: 'User with this email already exist. Use different email',
//       });
//     }
//   } catch (error) {
//     console.log('error: ', error);
//     res.send({ message: 'Registration failed. Try again' });
//   }
// };

// export const verifyEmail = async (req: Request, res: Response) => {
//   // TODO: check whether the key is a valid UUID

//   try {
//     const key = req.query.key;

//     if (key) {
//       const userVerified = await verifyUserEmail(key as string);

//       if (userVerified) {
//         return res.redirect(
//           `${process.env.FRONTEND_URL}/login?user=${userVerified}` as string,
//         );
//       }

//       return (
//         res
//           // .json({ message: 'Verification link expired. Please register again.' });
//           .redirect(`${process.env.FRONTEND_URL}/register?user=link-expired`)
//       );
//     }
//   } catch (error) {
//     console.error('Email verification failed: ', error);
//     return res.status(500).json({
//       message:
//         'Email verification failed. Please register again in few minutes.',
//     });
//     //.redirect(`${process.env.FRONTEND_URL}/register`);
//   }
// };

// // export const authenticate = async (req: Request, res: Response) => {
// //   try {
// //     //REMOVE
// //     console.log('Authentication request - test debugger - new');

// //     const user = await authenticateUser(req.body.email, req.body.password);

// //     if (user) {
// //       const token = generateToken(user._id.toString());
// //       res.cookie('token', token, {
// //         httpOnly: process.env.NODE_ENV === 'production',
// //         secure: process.env.NODE_ENV === 'production',
// //         sameSite: 'strict',
// //       });
// //       res.json(user).status(200);
// //     } else {
// //       res.send('Invalid credentials').status(401);
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     res.send('Login failed. Try again').status(500);
// //   }
// // };

// export const verify = async (req: Request, res: Response) => {
//   try {
//     if (req.isUnauthenticated()) {
//       return res.json({ message: 'Unauthorized' });
//     }
//     if (req.isAuthenticated()) {
//       return res.status(200).json({ message: 'Authenticated' });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// export const logout = async (req: Request, res: Response) => {
//   const sessionID = req.sessionID;
//   req.logout((err) => {
//     if (err) {
//       console.error('Error during logout:', err);
//       return res.status(500).send({ message: 'Logout failed' });
//     }
//     req.sessionStore.destroy(sessionID, (err) => {
//       if (err) {
//         console.error('Error destroying session on session store:', err);
//         return res
//           .status(500)
//           .send({ message: 'Could not destroy session on session store' });
//       }
//       req.session.destroy((err) => {
//         if (err) {
//           console.error('Error destroying session:', err);
//           return res.status(500).send({ message: 'Could not destroy session' });
//         }
//         res.clearCookie('connect.sid', { path: '/' }); // Clear the session cookie
//         res.status(200).send({ message: 'Logged out successfully' });
//       });
//     });
//   });
// };

// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const user = await getUserByEmail(req.body.email);

//     if (user) {
//       const emailSent = await sendPasswordResetLink(req.body.email);

//       if (emailSent) {
//         return res.status(200).send({ message: 'Password reset link sent' });
//       }
//     }

//     return res.send({ message: 'no user' });
//   } catch (error) {
//     console.error('Could not send password reset link: ', error);
//     return res
//       .status(500)
//       .send({ message: 'Could not send password reset link, Try again' });
//   }
// };

// // export const forgotPasswordInitiated = async (req: Request, res: Response) => {
// //   try {
// //     const mail = req.query.mail;

// //     if (mail) {
// //       const initiated = await checkForgotPasswordInitiated(mail as string);

// //       if (initiated) {
// //         return res.status(200).send({ message: 'Initiated' });
// //       }
// //     }

// //     return res.status(400).send({ message: 'Not Initiated' });
// //   } catch (error) {
// //     console.error('Error checking forgot password initiation: ', error);
// //     return res.status(500).send({ message: 'Not Initiated' });
// //   }
// // };

// export const forgotPasswordVerify = async (req: Request, res: Response) => {
//   // TODO: check whether the key is a valid UUID

//   try {
//     const key = req.query.key;

//     if (key) {
//       const user = await getUserByKey(key as string);

//       if (user) {
//         res.cookie('key', key, {
//           httpOnly: process.env.NODE_ENV === 'production',
//           secure: process.env.NODE_ENV === 'production',
//         });
//         res.cookie('email', user.email, {
//           httpOnly: process.env.NODE_ENV === 'production',
//           secure: process.env.NODE_ENV === 'production',
//         });
//         return res.redirect(`${process.env.FRONTEND_URL}/reset-password`);
//       }

//       return res.redirect(
//         `${process.env.FRONTEND_URL}/login?reset-user=expired`,
//       );
//     }
//   } catch (error) {
//     console.error('Password reset failed: ', error);
//     return res.redirect(`${process.env.FRONTEND_URL}/login?reset-user=expired`);
//   }
// };

// export const resetPassword = async (req: Request, res: Response) => {
//   const { password } = req.body;
//   const key = req.cookies['key'];
//   const email = req.cookies['email'];

//   try {
//     if (email && password && key) {
//       const resetStatus = await resetUserPassword(email, password, key);

//       if (resetStatus === 'success') {
//         console.log('Password reset successful: ', email);
//         res.clearCookie('key', { path: '/' });
//         res.clearCookie('email', { path: '/' });
//         return res.status(200).json({ message: 'success' });
//         // res.redirect(
//         //   `${process.env.FRONTEND_URL}/login?reset-user=${userID}` as string,
//         // );
//       }
//       if (resetStatus === 'expired') {
//         res.clearCookie('key', { path: '/' });
//         res.clearCookie('email', { path: '/' });
//         return res.json({ message: 'expired' });
//       }
//     }

//     res.clearCookie('key', { path: '/' });
//     res.clearCookie('email', { path: '/' });
//     return res.json({ message: 'failed' });
//   } catch (error) {
//     console.error('Password reset failed: ', error);
//     res.clearCookie('key', { path: '/' });
//     res.clearCookie('email', { path: '/' });
//     return res.json({ message: 'failed' });
//   }
// };

// // @desc check whether a user is verified
// // @route GET /auth/user-email-verified
// // @access public
// export const checkUserEmailVerified = async (req: Request, res: Response) => {
//   const userID = req.query.user;

//   if (userID) {
//     try {
//       const isUserVerified = await _checkUserEmailVerified(userID as string);

//       if (isUserVerified) {
//         return res.status(200).send({ message: 'Verified' });
//       }

//       return res.send({ message: 'Unverified' });
//     } catch (error) {
//       console.error(
//         `User verification check failed for user ${userID} with error : `,
//         error,
//       );
//       return res
//         .status(500)
//         .json({ message: 'User verification check failed' });
//     }
//   }
// };
