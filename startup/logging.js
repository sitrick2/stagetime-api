const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const config = require('config');

module.exports = function () {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.File({ filename: '/logs/error.log', level: 'error', handleExceptions: true }),
            new winston.transports.File({ filename: '/logs/testing.log', level: 'debug' }),
            new winston.transports.File({filename: '/logs/combined.log'}),
            new winston.transports.MongoDB({ db: config.get('db'), level: 'error' })
        ],
    });

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.prettyPrint(),
                winston.format.colorize()
            )})
        );
    }

    return logger;
};