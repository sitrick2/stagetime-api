const users = require('../routes/users');
const error = require('../middleware/error');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));
    app.use('/api/users', users);
    app.use(error);
};