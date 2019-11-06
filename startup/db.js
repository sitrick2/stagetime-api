const mongoose = require('mongoose');
const config = require('config');
const logger = require('./logging')();

module.exports = function () {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };

    const db = config.get('db');
    mongoose.connect(db, options)
        .then(() => logger.info(`Connected to ${ db }...`));
};