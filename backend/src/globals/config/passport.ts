import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { makeUserModel } from '../../api/v1/data-access';
import { authenticateUser } from '../../api/v1/use-cases';
import { IUserDto } from '../../api/v1/data-access/interfaces/IUserDto';

const passportConfig = (_passport: passport.PassportStatic) => {
  const User = makeUserModel();
  _passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/api/v1/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const _email = profile.emails?.at(0)?.value;
        const newUser = {
          authType: 'google',
          email: _email as string,
          googleId: profile.id,
          name: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          image: profile.photos?.at(0)?.value,
        };

        try {
          let user = await User.findByEmail(_email as string);

          if (user) {
            done(null, user);
          } else {
            user = await User.createNewOAuth(newUser);
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
    done(null, (user as IUserDto).id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByUserId(id as string);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passportConfig;
