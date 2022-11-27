const ProductService = require("../../models/services/productService");

exports.getProductsApi = (req, res, next) => {
  //Product.test('color'); //test

  const page = +req.query.page || 1;
  let productsPerPage = +req.query.productsPerPage || 12;
  let productsCount;
  const name = req.query.name
    ? { $regex: `.*${req.query.name}.*`, $options: "i" }
    : null;
  let color = null;
  if (req.query.color) {
    let colorRegexString = ""; //match chuỗi có sự xuất hiện của bất kỳ từ nào trong array
    req.query.color.forEach((c) => {
      colorRegexString += c + "|";
    });
    colorRegexString = colorRegexString.slice(0, -1); //remove last '|' char
    color = { $regex: `.*(${colorRegexString}).*`, $options: "i" };
  }
  let category = req.query.category;
  if (category === "Tất cả sản phẩm") {
    category = null; //remove
  }
  const filters = {
    name,
    category,
    brand: req.query.brand,
    color,
    sex: req.query.sex,
    shoesHeight: req.query.shoesHeight,
    closureType: req.query.closureType,
    material: req.query.material,
  };
  Object.keys(filters).forEach(
    (key) => filters[key] === undefined && delete filters[key]
  ); // remove các filter null or undefined
  Object.keys(filters).forEach(
    (key) => filters[key] === null && delete filters[key]
  ); // remove các filter null or undefined
  const sortBy = req.query.sortBy || "price";
  ProductService.countProducts(filters)
    .then((n) => {
      productsCount = n;
      if (req.query.productsPerPage === "All") {
        productsPerPage = n;
      }
      return ProductService.getProducts(filters)
        .collation({ locale: "en" })
        .sort(sortBy)
        .skip((page - 1) * productsPerPage)
        .limit(productsPerPage);
    })
    .then((products) => {
      res.status(200).send({
        products,
        productsPerPage,
        queriedProductCount: products.length,
        productsCount,
        currentPage: page,
        lastPage: Math.ceil(productsCount / productsPerPage),
      });
    });
};
