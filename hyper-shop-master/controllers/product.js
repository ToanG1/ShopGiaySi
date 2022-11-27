const ProductService = require("../models/services/productService"); // nhớ pass categories cho tất cả các view

const CommentService = require("../models/services/commentService");
const ResponseService = require("../models/services/responseService");

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let productsPerPage = +req.query.productsPerPage || 12;
  let productsCount;
  let category = req.query.category;
  if (category === "Tất cả sản phẩm") {
    category = null; //remove
  }
  if (category === "all") {
    category = null; //remove
  }
  const name = req.query.name
    ? { $regex: `.*${req.query.name}.*`, $options: "i" }
    : null;
  const filters = {
    name,
    category,
    brand: req.query.brand,
    color: req.query.color,
    sex: req.query.sex,
    shoesHeight: req.query.shoesHeight,
    closureType: req.query.closureType,
    material: req.query.material,
  };
  Object.keys(filters).forEach(
    (key) => filters[key] === undefined && delete filters[key]
  );
  Object.keys(filters).forEach(
    (key) => filters[key] === null && delete filters[key]
  );

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
    .then(async function (products) {
      res.status(200).render("shop/products", {
        pageTitle: "Products",
        products,
        productsPerPage,
        productsCount,
        currentPage: page,
        lastPage: Math.ceil(productsCount / productsPerPage),
        categories: await ProductService.getCategoriesQuantity(),
        brands: await ProductService.getBrands(),
        closureTypes: await ProductService.getClosureTypes(),
        shoesHeights: await ProductService.getShoesHeights(),
        materials: await ProductService.getMaterials(),
        user: req.user,
      });
    });
};

exports.getProductDetail = async (req, res, next) => {
  const commentsPerPage = 10;
  const productId = req.params.productId;
  const product = await ProductService.getProduct(productId);
  product.viewCount += 1;
  product.save();
  const comments = await CommentService.getProductComments(productId);
  const responses = await ResponseService.getResponses(comments);
  const commentsCount = await CommentService.countComments(productId);
  const relatedProducts = await ProductService.getRelatedProducts({
    brand: product.brand,
    _id: { $ne: product._id },
  });
  res.status(200).render("shop/productDetail", {
    product: product,
    pageTitle: "Product detail",
    comments,
    responses,
    commentsCurrentPage: 1,
    commentsLastPage: Math.ceil(commentsCount / commentsPerPage),
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
    user: req.user,
    relatedProducts,
  });
};
