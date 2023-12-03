import createLogger from 'pino';

const logger = createLogger({
  formatters: {
    level: (label) => {
      return {
        level: label
      }
    }
  }
});

export default logger;
