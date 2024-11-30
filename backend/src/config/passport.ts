import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/user';
import { authenticateUser } from '../services/authService';

const passportConfig = (_passport: passport.PassportStatic) => {
  _passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const _email = profile.emails?.at(0)?.value;
        const newUser = {
          authType: 'google',
          email: _email,
          googleId: profile.id,
          name: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          image: profile.photos?.at(0)?.value,
        };

        try {
          let user = await User.findOne({ email: _email });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.error(error);
        }
      },
    ),
  );

  _passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await authenticateUser(username, password);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, (user as IUser)._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passportConfig;
