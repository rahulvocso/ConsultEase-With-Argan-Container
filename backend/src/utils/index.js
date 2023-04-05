import pino from 'pino';

const Utils = {
  io: null,
  logger: pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
};

export default Utils;
