const UserService = require("../../models/services/userService");
exports.getUsersApi = async (req, res, next) => {
  const ITEMS_PER_PAGE = 10;
  let page = req.query.page || 1;
  const isAdmin = req.query.isAdmin || false;
  const isLock = req.query.isLock;
  let users;
  if (isLock != undefined) {
    users = await UserService.getUsersApi({ isAdmin, isLock });
  } else {
    users = await UserService.getUsersApi({ isAdmin });
  }

  const usersCount = users.length;

  if (page === "First") page = 1;
  if (page === "Last") page = Math.ceil(usersCount / ITEMS_PER_PAGE);

  if (isLock != undefined) {
    users = await UserService.getUsersApi({ isAdmin, isLock })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  } else
    users = await UserService.getUsersApi({ isAdmin })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

  res.status(200).send({
    users,
    page,
    lastPage: Math.ceil(usersCount / ITEMS_PER_PAGE),
  });
};

exports.postActionUser = async (req, res, next) => {
  await UserService.Block_Unblock(req.body.userId);
  res.status(200).send({
    msg: "Action on account!",
  });
};
