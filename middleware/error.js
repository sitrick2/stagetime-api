const logger = require('../startup/logging')();

module.exports = function (err, req, res, next) {
    logger.error(err.message, err);
    console.log(err);
    if (err.name === 'ValidationError')
        return res.status(400).send(err.message);
    res.status(500).send('Something failed.');
};