const UserService = require('../models/services/userService');
exports.getUserList = async (req, res, next) => {
  const ITEMS_PER_PAGE = 10;
  const search = req.query.search;

  let page = +req.query.page || 1;

  const totalUsers = await UserService.getUsers({
    isAdmin: 0,
  }).countDocuments();
  let userList;

  if (!search) {
    userList = await UserService.getUsers({isAdmin: 0})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  } else {
    const regex = new RegExp(`^.*${search}.*$`, 'i');
    userList = await UserService.getUsers({
      isAdmin: false,
      $or: [{name: {$regex: regex}}, {email: {$regex: regex}}],
    })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  }

  res.status(200).render('shop/userList', {
    pageTitle: 'User list',
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

exports.getUserDetail = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await UserService.getUser({_id: userId});
  res.status(200).render('shop/userDetail', {
    pageTitle: 'User Profile',
    user,
  });
};
