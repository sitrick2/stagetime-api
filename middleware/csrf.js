module.exports = function(req, res, next){
  res.locals._csrf = req.csrfToken();
  next();
};
