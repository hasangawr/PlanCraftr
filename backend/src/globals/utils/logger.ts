import pino from 'pino-http';

const logger = pino({
  quietReqLogger: true,
  transport: {
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: `${process.env.LOGS_PATH}/app.log`,
          append: true,
        },
      },
      {
        target: 'pino/file',
        options: {
          destination: `${process.env.LOGS_PATH}/error.log`,
          append: true,
        },
        level: 'error',
      },
    ],
  },
});

export default logger;
