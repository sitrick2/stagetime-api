const { printf } = require('winston').format;

exports.defaultFormat = printf(({level, message, timestamp, stack}) => {
        return `${timestamp} [${level}]: ${message}`;
    });

exports.errorFormat = printf(({level, message, timestamp, stack}) => {
        return `${timestamp} [${level}]: ${message} - ${stack}`;
    });