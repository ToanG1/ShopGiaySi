const ProductService = require('../models/services/productService'); // nhớ pass categories cho tất cả các view !!!
const authService = require('../models/services/authService');
const UserService = require('../models/services/userService'); // nhớ pass categories cho tất cả các view

const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

exports.getSignup = async (req, res, next) => {
  res.status(200).render('auth/signup', {
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    user: req.user,
  });
};

exports.signup = async (req, res, next) => {
  let {name, email, phone, password, confirmPassword} = req.body; //lấy các thông tin name, email,... từ requestz
  email = email.toLowerCase();
  let user = {name, email, phone, password, confirmPassword};
  let errors = [];
  if (!name || !email || !phone || !password || !confirmPassword) {
    errors.push({msg: 'Vui lòng điền hết thông tin'});
  }

  var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
  if(password.length < 8 || password.length > 15) {
    errors.push({msg: 'Mật khẩu phải có từ 6 - 15 ký tự'});
  }
  else if(!passwordRegex.test(password)){
    errors.push({msg: 'Mật khẩu phải chứa ít nhất 1 chữ cái hoa, một số, và một ký tự đặc biệt'});
  }

  if (password.length == 0 || password != confirmPassword) {
    errors.push({msg: 'Mật khẩu không trùng khớp'});
  }

  var phoneRegerx = /^([0][1-9]{9})$/;
  if (!phoneRegerx.test(phone)) {
    errors.push({msg: 'Số điện phải 10 chữ số'});
  }
  //check email format
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if (!emailRegex.test(email)) {
    errors.push({msg: 'Email không hợp lệ'});
  }
  //Check existed email
  const existsUser = await authService.getUserLean({email: email});
  if (existsUser) {
    errors.push({msg: 'Email đã tồn tại'});
  }
  if (errors.length > 0) {
    return res.status(400).render('auth/signup', {
      errors: errors,
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: user,
    });
  } else if (errors.length == 0) {
    // tạo token verify qua mail
    crypto.randomBytes(32, async (err, buffer) => {
      user.verifyToken = buffer.toString('hex');
      // Thời gian tồn tại của token này +millisecond
      user.verifyTokenExpiration = Date.now() + 3600000;
      console.log(user.email);
      try {
        //gửi email verify
        transporter.sendMail({
          to: user.email,
          from: process.env.SENDGRID_EMAIL,
          subject: 'Hyper-shop email vefification',
          html: `
            <p>You sign up to hyper shop</p>
            <p><a href="${process.env.DOMAIN}/auth/verify/${user.verifyToken}">Click this</a> to verify your email</p>
            `,
        });

        //validation pass -> save to db
        await authService.signup(user);
        return res.status(200).render('auth/signup', {
          success_msg: 'Đăng ký thành công, chờ xác nhận email để đăng nhập',
          categories: await ProductService.getCategoriesQuantity(),
          brands: await ProductService.getBrands(),
          user: req.user,
        });
      } catch (e) {
        //--------TODO-------
        //Lỗi trong lúc create trong mongodb, chưa handle
        console.log(e);
        res.status(400).render('auth/signup', {
          categories: await ProductService.getCategoriesQuantity(),
          brands: await ProductService.getBrands(),
          user: user,
        });
      }
    });
  }
};

exports.getSignin = async (req, res, next) => {
  res.render('auth/signin', {
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    user: req.user,
  });
};
exports.signin = async (req, res, next) => {
  res.status(200).redirect(req.session.returnTo || '/');
  delete req.session.returnTo;
};
exports.getReset = async (req, res, next) => {
  res.render('auth/reset', {
    user: req.user,
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
  });
};
exports.postReset = async (req, res, next) => {
  const user = await authService.getUser({email: req.body.email});
  if (!user) {
    return res.render('auth/reset', {
      errors: [{msg: 'Email này chưa được đăng ký!!!'}],
      user: req.user,
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
    });
  }
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/auth/reset');
    }
    const token = buffer.toString('hex');
    user.resetToken = token;
    // Thời gian tồn tại của token này +millisecond
    user.resetTokenExpiration = Date.now() + 3600000;
    await authService.save(user);
  });
  try {
    res.render('auth/reset', {
      success_msg: 'Kiểm tra email để xác nhận mật khẩu mới',
      user: req.user,
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
    });
    transporter.sendMail({
      to: user.email,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Hyper-shop reset password',
      html: `
      <p>You request a password reset</p>
      <p><a href="${process.env.DOMAIN}/auth/reset/${user.resetToken}">Click this</a> to reset your password</p>
      `,
    });
  } catch (e) {
    //TODO: render reset with error message
    console.log(e);
    res.redirect('/auth/reset');
  }
};

exports.getNewPassword = async (req, res, next) => {
  const user = await authService.getUserLean({
    resetToken: req.params.token,
    resetTokenExpiration: {$gt: Date.now()},
  });
  if (!user) {
    return res.render('auth/reset', {
      errors: [{msg: 'Reset token expired, request a new one'}],
      user: req.user,
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
    });
  }
  res.render('auth/newpassword', {
    user: req.user,
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    userId: user._id,
    resetToken: req.params.token,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const {password, userId, resetToken} = req.body;
  //TODO: match password

  //check valid token
  const user = await authService.getUser({
    resetToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId,
  });
  if (!user) {
    return res.render('auth/reset', {
      errors: [{msg: 'Reset token expired, request a new one'}],
      user: req.user,
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
    });
  }
  //if token is valid
  else {
    res.render('auth/signin', {
      success_msg: 'Cập nhật mật khẩu mới thành công',
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: user,
    });
    //clear token and reset password
    user.resetTokenExpiration = undefined;
    user.resetToken = undefined;
    user.password = password;
    await authService.updatePassword(user);
  }
};

exports.emailVerify = async (req, res, next) => {
  const user = await authService.getUser({
    verifyToken: req.params.verifyToken,
    verifyTokenExpiration: {$gt: Date.now()},
  });
  if (!user) {
    res.render('auth/updatePassword', {
      errors: [{msg: 'Invalid verify token'}],
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: req.user,
    });
  } else {
    user.isLock = false;
    user.verifyToken = undefined;
    user.verifyTokenExpiration = undefined;
    await UserService.saveUser(user);
    res.render('auth/updatePassword', {
      success_msg: 'Tài khoản được cập nhật, hãy đăng nhập',
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: req.user,
    });
  }
};
