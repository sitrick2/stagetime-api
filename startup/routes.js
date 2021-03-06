const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const cors = require('../middleware/cors');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors);
    app.use('/api/users', users);
    app.use('/auth', auth);
    app.use(error);
};
