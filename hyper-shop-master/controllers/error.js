const ProductService = require('../models/services/productService'); // nhớ pass categories cho tất cả các view

exports.get404Error = async (req, res, next)=>{
    res.status(404).render('shop/404', {
        categories: await ProductService.getCategoriesQuantity(),
        brands: await ProductService.getBrands(),
        user: req.user,
    });
}