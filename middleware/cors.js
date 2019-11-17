const config = require('config');

module.exports = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', config.get('frontendUrl'));
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
  next();
};
