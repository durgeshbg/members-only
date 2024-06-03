exports.index = (req, res, next) => {
  res.render('index', { title: 'Express', user: req.user });
};

exports.profile = [
  isAuth,
  (req, res, next) => {
    res.render('profile', { title: 'Profile', user: req.user });
  },
];

exports.joinclub_get = () => {};
exports.joinclub_post = () => {};
