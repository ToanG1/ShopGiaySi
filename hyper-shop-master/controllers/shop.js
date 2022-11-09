const ProductService = require('../models/services/productService'); // nhớ pass categories cho tất cả các view

exports.getIndex = async (req, res, next) => {
  const hotProducts = await ProductService.getTopProducts(10);
  res.status(200).render('shop/index', {
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    user: req.user,
    hotProducts
  });
  req.session.cart = [];
};
