const ProductService = require("../models/services/productService"); // nhớ pass categories cho tất cả các view
const UserService = require("../models/services/userService"); // nhớ pass categories cho tất cả các view
const bcrypt = require("bcrypt");
exports.getProfile = async (req, res, next) => {
  res.status(200).render("shop/profile", {
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    profile: req.user,
    user: req.user,
  });
};

exports.postProfile = async (req, res, next) => {
  const { name, phone, address } = req.body; //lấy các thông tin name, email,... từ requestz
  let errors = [];
  if (!name || !phone || !address) {
    errors.push({ msg: "Please enter all fields" });
  }
  var phoneRegerx = /^([0][1-9]{9})$/;
  if (!phoneRegerx.test(phone)) {
    errors.push({ msg: "Phone number need to be 10-digit format" });
  }
  if (errors.length > 0) {
    return res.status(400).render("shop/profile", {
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
    await UserService.updateProfile(newProfile);
    res.status(200).redirect("/user/profile");
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  res.status(200).render("auth/updatePassword", {
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    profile: req.user,
    user: true,
  });
};

exports.postUpdatePassword = async (req, res, next) => {
  const isMatch = await bcrypt.compare(
    req.body.currentpassword,
    req.user.password
  );
  if (isMatch) {
    const user = {
      password: req.body.password,
      _id: req.user._id,
    };
    const remp = await UserService.updatePassword(user);
    res.render("auth/updatePassword", {
      success_msg: "Password changed",
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: req.user,
    });
  }
  res.render("auth/updatePassword", {
    errors: [{ msg: "Wrong current password" }],
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    user: req.user,
  });
};
