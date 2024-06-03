exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) next();
  res.redirect('/login');
};
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) next();
  res.locals.notAdmin = 'Unauthorired: you are not an admin!';
  res.status(403);
};
exports.isNotAuth = (req, res, next) => {
  if (req.isAuthenticated()) res.redirect('/profile');
  next();
};
