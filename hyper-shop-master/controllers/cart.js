const ProductService = require("../models/services/productService"); // nhớ pass categories cho tất cả các view
const cartService = require("../models/services/cartService");
const { ObjectId } = require("mongodb");

exports.getCart = async (req, res, next) => {
  let userCart = null;
  //nếu người dùng đã đăng nhập
  if (req.user) {
    if (req.session.cart) {
      //nếu đã tạo cart ảo trong session trước đó rồi)
      const products = [];

      for (let product of req.session.cart) {
        products.push(product);
      }
      userCart = await cartService.addProductToCart(req.user, products); //cập nhật hàng trong cart ảo vào trong cart trong db
      req.session.cart = null;
    } else {
      userCart = await cartService.getCartByUserId(req.user); //nếu chưa có cart ảo thì tìm cart thật
      if (userCart == null) {
        userCart = await cartService.createNewCart(req.user);
      }
    }
    res.status(200).render("shop/cart", {
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: req.user,
      cart: userCart,
    });
  } else {
    res.status(200).render("shop/cart", {
      categories: await ProductService.getCategoriesQuantity(),
      brands: await ProductService.getBrands(),
      user: req.user,
      cart: req.session.cart,
    });
  }
};

exports.addToCart = async (req, res, next) => {
  if (req.user) {
    let cart = await cartService.getCartByUserId(req.user);
    if (!cart) {
      cart = await cartService.createNewCart(req.user);
    }
    const product = await ProductService.getProduct(req.body.id);
    await cartService.addSingleProductToCart(product, req.body.size, cart);
    res.status(200).send("Add cart successfully");
  } else {
    if (!req.session.cart) {
      //nếu session chưa có cart thì tạo cart cùng với sản phẩm
      ProductService.getProduct(req.body.id).then((product) => {
        req.session.cart = [
          {
            product: product,
            quantity: 1,
            size: req.body.size,
          },
        ];
        res.status(200).send("Add cart successfully");
      });
    } else {
      //nếu session đã có cart thì thêm sản phẩm vào cart
      let checkExisted = false;
      for (let i = 0; i < req.session.cart.length; i++) {
        if (
          req.session.cart[i].product._id.toString() === req.body.id &&
          req.session.cart[i].size.toString() === req.body.size
        ) {
          req.session.cart[i].quantity += 1;
          res.status(200).send("Add cart successfully");
          checkExisted = true;
          break;
        }
      }
      if (!checkExisted) {
        ProductService.getProduct(req.body.id).then((product) => {
          req.session.cart.push({
            product: product,
            quantity: 1,
            size: req.body.size,
          });
          res.status(200).send("Add cart successfully");
        });
      }
    }
  }
};

exports.getCheckout = async (req, res, next) => {
  res.status(200).render("shop/checkout", {
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    user: req.user,
    cart: await cartService.getCartByUserId(req.user),
  });
};
