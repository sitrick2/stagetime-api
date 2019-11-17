const express = require('express');
const app = express();

require('./startup/config')();
require('./startup/db')();
require('./startup/ssl-setup')(app);
require('./startup/routes')(app);
// require('./startup/validation')();
// require('./startup/prod')(app);

module.exports = require('./startup/server')(app);
