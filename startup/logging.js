const { createLogger, format, transports } = require('winston');
const { combine, timestamp } = format;
const { defaultFormat, errorFormat } = require ('../logging/formatters');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {

    const logger = createLogger({
        level: 'info',
        format: format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            new transports.File({
                filename: `${__dirname}/../logs/combined.log`,
                format: combine(
                    timestamp(),
                    defaultFormat
                )
            }),

            new transports.File({
                filename: `${__dirname}/../logs/error.log`,
                format: combine(
                    timestamp(),
                    errorFormat
                ),
                level: 'error'
            }),

            new transports.File({
                filename: `${__dirname}/../logs/testing.log`,
                format: combine(
                    timestamp(),
                    defaultFormat
                ),
                level: 'debug'
            }),
        ],
    });

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.simple(),
                format.printf(msg =>
                    format.colorize().colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
                )
            )})
        );
    }

    return logger;
};