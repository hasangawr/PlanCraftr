import pino from 'pino-http';

const logger = pino({
  quietReqLogger: true,
  transport: {
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: `${process.env.LOGS_PATH}/app.log`,
          mkdir: true,
          append: true,
        },
      },
      {
        target: 'pino/file',
        options: {
          destination: `${process.env.LOGS_PATH}/error.log`,
          mkdir: true,
          append: true,
        },
        level: 'error',
      },
    ],
  },
});

export default logger;
