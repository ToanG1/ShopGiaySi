const AdminService = require('../models/services/adminService');
const ProductService = require('../models/services/productService');
const UserService = require('../models/services/userService');
const OrderService = require('../models/services/orderService');
const bcrypt = require('bcrypt');

exports.getAdmins = async (req, res, next) => {
  const admins = await AdminService.getAdmins();
  res.status(200).render('shop/adminList', {
    pageTitle: 'Admin List',
    admins,
    user: req.user,
  });
};

exports.getProfile = (req, res, next) => {
  res.status(200).render('shop/profile', {
    pageTitle: 'Profile',
    user: req.user,
  });
};

exports.postProfile = async (req, res, next) => {
  const {name, phone, address} = req.body; //lấy các thông tin name, email,... từ requestz
  let errors = [];
  if (!name || !phone || !address) {
    errors.push({msg: 'Please enter all fields'});
  }
  var phoneRegerx = /^([0][1-9]{9})$/;
  if (!phoneRegerx.test(phone)) {
    errors.push({msg: 'Phone number need to be 10-digit format'});
  }
  if (errors.length > 0) {
    return res.status(400).render('shop/profile', {
      pageTitle: 'Profile',
      errors: errors,
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: req.user,
      profile: req.user,
    });
  } else {
    const newProfile = {
      _id: req.user._id,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
    };
    await AdminService.updateProfile(newProfile);
    res.status(200).redirect('/admins/profile');
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  res.status(200).render('auth/updatePassword', {
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    profile: req.user,
    user: true,
    pageTitle: 'Change password',
  });
};

exports.postUpdatePassword = async (req, res, next) => {
  const isMatch = await bcrypt.compare(req.body.currentpassword, req.user.password);
  if (isMatch) {
    const user = {
      password: req.body.password,
      _id: req.user._id,
    };
    const remp = await UserService.updatePassword(user);
    res.render('auth/updatePassword', {
      success_msg: 'Password changed',
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: req.user,
      pageTitle: 'Change password',
    });
  }
  res.render('auth/updatePassword', {
    errors: [{msg: 'Wrong current password'}],
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    user: req.user,
    pageTitle: 'Change password',
  });
};

//
exports.getAdmin = async (req, res, next) => {
  const profile = await AdminService.getAdmin({_id: req.params.id});
  if (!profile) return res.status(400).redirect('/'); //status?
  res.status(200).render('shop/adminDetails', {
    pageTitle: 'Admin Details',
    profile,
    user: req.user,
  });
};
exports.getAddAdmin = async (req, res, next) => {
  res.status(200).render('shop/addAdmin', {
    pageTitle: 'Add Admin',
    user: req.user,
  });
};
exports.addAdmin = async (req, res, next) => {
  const {name, email, password, phone} = req.body;
  try {
    await AdminService.addAdmin({
      name,
      email,
      password,
      phone,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).render('shop/addAdmin', {
      pageTitle: 'Add Admin',
      categories: await ProductService.getCategoriesQuantity(),
      user: req.user,
    }); //nếu catch đc bất kỳ lỗi nào thì chuyển về
  }
  return res.status(201).redirect('/admins');
};

exports.getAdminList = async (req, res, next) => {
  const ITEMS_PER_PAGE = 10;
  let page = +req.query.page || 1;
  const search = req.query.search;

  const totalUsers = await UserService.getUsers({
    isAdmin: 1,
  }).countDocuments();
  let userList;

  if (!search) {
    userList = await UserService.getUsers({isAdmin: true})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  } else {
    const regex = new RegExp(`^.*${search}.*$`, 'i');
    userList = await UserService.getUsers({
      isAdmin: true,
      $or: [{name: {$regex: regex}}, {email: {$regex: regex}}],
    })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  }
  res.status(200).render('shop/adminList', {
    pageTitle: 'Admin list',
    user: req.user,
    userList,
    totalUsers,
    currentPage: page,
    hasNextPage: totalUsers > page * ITEMS_PER_PAGE,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalUsers / ITEMS_PER_PAGE),
  });
};

exports.getRevenue = async (req, res, next) => {
  res.render('statistics/revenue', {
    pageTitle: 'Revenue',
    user: req.user,
    topProducts: await ProductService.getTopProducts(),
  });
};

exports.getRevenueDates = async (req, res, next) => {
  const weeks = req.body;
  revenueDates = [];
  for (date of weeks) {
    const count = await OrderService.getOrderByOrderedDate(date);
    revenueDates.push(count);
  }
  res.status(200).send(revenueDates);
};

exports.getRevenueMonth = async (req, res, next) => {
  const data = req.body;
  revenueMonths = [];
  for (month of data.months) {
    const count = await OrderService.getOrderByOrderedMonth(month, data.year);
    revenueMonths.push(count);
  }
  res.status(200).send(revenueMonths);
};
