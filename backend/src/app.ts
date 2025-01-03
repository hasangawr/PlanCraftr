import express from 'express';
import authRoutes from './routes/authRoutes';
import connectDB from './utils/db';
import cors from 'cors';
import passport from 'passport';
import passportConfig from './config/passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';

const app = express();

passportConfig(passport);

connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionSuccessStatus: 200,
};

app.set('trust proxy', true);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Welcome to PlanCraftr!!!');
});
app.use('/auth', authRoutes);

export default app;
