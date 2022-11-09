exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  let url = req.originalUrl.replace('/api', ''); //nếu người dùng tìm kiếm lọc sản phẩm bằng ajax, cần remove api đi

  if (url.includes('cart/checkout')) url = '/cart';

  if (!url.includes('/login') && req.method == 'GET') {
    req.session.returnTo = url;
  }

  res.redirect('/auth/signin');
};

exports.checkAuthenticatedForApi = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).send();
};

exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect('/');
  next();
};

//lưu lại url để khi người dùng đăng nhập, chuyển lại về trang cũ
exports.getUrl = (req, res, next) => {
  let url = req.originalUrl.replace('/api', ''); //nếu người dùng tìm kiếm lọc sản phẩm bằng ajax, cần remove api đi

  if (url.includes('cart/checkout')) url = '/cart';

  if (!url.includes('/login') && req.method != 'POST') {
    req.session.returnTo = url;
  }

  next();
};
