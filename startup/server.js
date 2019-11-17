const fs = require('fs');
const https = require('https');
const logger = require('./logging')();


module.exports = (app) => {
  const options = {
    key: fs.readFileSync(__dirname + '\\ssl\\cert.key'),
    cert: fs.readFileSync(__dirname + '\\ssl\\cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
  };

  const port = process.env.PORT || 80;
  return https.createServer(options, app)
    .listen(port, 'api.stagetime.dev', () => logger.info(`Listening on port ${port}...`));
};
