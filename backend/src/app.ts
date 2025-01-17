import { configDotenv } from 'dotenv';
configDotenv();

import express, { NextFunction, Request, Response } from 'express';
import authRoutes from './api/v1/routes/authRoutes';
import connectDB from './globals/config/db';
import cors from 'cors';
import passport from 'passport';
import passportConfig from './globals/config/passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { errorHandler } from './api/v1/handlers';
import logger from './globals/utils/logger';
import MongoStore from 'connect-mongo';

const app = express();

passportConfig(passport);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

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
      mongoUrl:
        process.env.NODE_ENV === 'test'
          ? process.env.MONGO_URI
          : process.env.MONGODB_URI,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(logger);

app.get('/', (req, res) => {
  res.send('Welcome to PlanCraftr!!!');
});
app.use('/api/v1/auth', authRoutes);

// error handler middleware
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    await errorHandler.handleError(err, res);
  } catch (error) {
    next(error);
  }
});

export default app;
