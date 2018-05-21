const winston = require('winston');
const Logger = winston.Logger;
const Console = winston.transports.Console;
const LoggingWinston = require('@google-cloud/logging-winston').LoggingWinston;
const loggingWinston = new LoggingWinston();

exports.default = new Logger({
  level: 'info',
  transports: [
    new Console(),
    loggingWinston,
  ],
});
