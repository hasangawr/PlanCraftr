import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError';
import logError from '../utils/logError';

let mailConfig;

if (process.env.NODE_ENV === 'production') {
  mailConfig = {
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
} else {
  mailConfig = {
    host: process.env.TEST_SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.TEST_SMTP_USER,
      pass: process.env.TEST_SMTP_PASS,
    },
  };
}

const transporter = nodemailer.createTransport(mailConfig);

export const verifyConnection = async (): Promise<boolean> => {
  // verify connection configuration
  try {
    const status = await transporter.verify();
    console.log('SMTP server ready...');
    return status;
  } catch (error) {
    console.error('EmailError', error);
    throw new AppError(
      'EmailError',
      500,
      'Failed to connect SMTP server',
      false,
    );
  }
};

export const sendEMail = async (
  from: string,
  to: string,
  subject: string,
  html: string,
) => {
  try {
    const info = await transporter.sendMail({
      from, //'"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to, //'bar@example.com, baz@example.com', // list of receivers
      subject, //'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html, //'<b>Hello world?</b>', // html body
    });

    console.log('message sent: ', info.messageId);
  } catch (error) {
    logError(error as Error);
    throw new AppError(
      'EmailError',
      500,
      `email sending failed when sending - ${subject}`,
      false,
    );
    // TODO: Recover from email failure --> at errorHandler
  }
};
