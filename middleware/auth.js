const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    console.log(req.headers);
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        req.user = jwt.verify(token, config.get('jwtPrivateKey'));
        next();
    } catch (ex) {
        res.status(400).send('Invalid login.');
    }

};
