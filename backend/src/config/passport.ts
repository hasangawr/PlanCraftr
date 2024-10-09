import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/user';

const passportConfig = (_passport: passport.PassportStatic) => {
  _passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          image: profile.photos?.at(0)?.value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

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

  passport.serializeUser((user, done) => {
    done(null, (user as IUser).googleId);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ googleId: id });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passportConfig;
