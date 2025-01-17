import { Response } from 'express';
import logger from 'pino-http';

const logError = (err: Error, res?: Response) => {
  try {
    if (res) {
      res.log.error(err, err.message);
    } else {
      logger(err);
    }
  } catch (error) {
    console.error('Logging error failed: ', error);
  }
};

export default logError;
