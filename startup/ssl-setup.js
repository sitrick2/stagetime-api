const session = require('express-session');
const config = require('config');

module.exports = (app) => {
  app.use(session({
    secret: config.get('sessionKey'),
    cookie: {
      httpOnly: true,
      secure: true
    },
    resave: false,
    saveUninitialized: false
  }));
};
