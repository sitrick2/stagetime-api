const fs = require('fs');
const https = require('https');
const logger = require('./logging')();
const session = require('express-session');
const csrf = require('csrf');
const config = require('config');

module.exports = (app) => {
  const options = {
    key: fs.readFileSync(__dirname + '\\ssl\\server.key'),
    cert: fs.readFileSync(__dirname + '\\ssl\\server.crt'),
    passphrase: 'local',
    requestCert: false,
    rejectUnauthorized: false
  };

  app.use(session({
    secret: config.get('sessionKey'),
    cookie: {
      httpOnly: true,
      secure: true
    }
  }));

  app.use(csrf());

  const port = process.env.PORT || 3000;
  return https.createServer(options, app)
    .listen(port, () => logger.info(`Listening on port ${port}...`));
};
