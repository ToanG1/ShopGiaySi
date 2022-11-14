const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const storage = multer.memoryStorage();

const ProductService = require("../models/services/productService");
const CommentService = require("../models/services/commentService");
const ResponseService = require("../models/services/responseService");

let upload = multer({
  storage: storage,
}).single("image");

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let productsPerPage = +req.query.productsPerPage || 12;
  let productsCount;
  const filters = {
    category: req.query.category,
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
  const sortBy = req.query.sortBy || "createdDate";

  ProductService.countProducts(filters)
    .then((n) => {
      productsCount = n;
      if (req.query.productsPerPage === "all") {
        productsPerPage = n;
      }
      return ProductService.getProducts(filters)
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
  const productId = req.params.productId;
  const comments = await CommentService.getProductComments(productId);
  const responses = await ResponseService.getResponses(comments);
  const product = await ProductService.getProduct(productId);

  return res.status(200).render("shop/productDetail", {
    pageTitle: "Product detail",
    bannerText: "Product",
    product: product,
    comments,
    responses,
    user: req.user,
  });
};

exports.getAddProduct = (req, res, next) => {
  res.status(200).render("shop/addProduct", {
    pageTitle: "Add product",
    error: null,
    product: {},
    user: req.user,
  });
};

// exports.postAddProduct = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(req.file);
//       const product = {
//         name: req.body.productName,
//         brand: req.body.brand,
//         price: req.body.price,
//         color: req.body.color,
//         gender: req.body.gender,
//         height: req.body.height,
//         closure: req.body.closure,
//         material: req.body.material,
//         category: req.body.category,
//         image: "/img/" + req.file.filename,
//       };
//       ProductService.createProduct(product).then((result) => {
//         console.log("Created product");
//         res.status(200).render("shop/addProduct", {
//           pageTitle: "Add product",
//         });
//       });
//     }
//   })
// };

exports.postAddProduct = (req, res, next) => {
  upload(
    req,
    res,
    (err = async () => {
      const product = {
        name: req.body.productName,
        brand: req.body.brand,
        price: req.body.price,
        color: req.body.color,
        gender: req.body.gender,
        height: req.body.height,
        closure: req.body.closure,
        material: req.body.material,
        category: req.body.category,
      };

      const checktype = req.file.mimetype;
      if (!checktype.includes("image")) {
        res.status(400).render("shop/addProduct", {
          product: product,
          pageTitle: "Add product",
          error: "Type of image file is not appropriate",
          user: req.user,
        });
      } else {
        (product.image = "/img/" + req.file.originalname),
          await sharp(req.file.buffer)
            .resize({
              width: 592,
              height: 592,
            })
            .toFile("./public/img/" + req.file.originalname);

        ProductService.createProduct(product).then((result) => {
          console.log("Created product");
          res.redirect("addProduct");
        });
      }
    })
  );
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  ProductService.getProduct(productId).then((product) => {
    res.status(200).render("shop/editProduct", {
      product: product,
      pageTitle: "Edit product",
      error: null,
      user: req.user,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  upload(
    req,
    res,
    (err = async () => {
      const product = {
        id: req.body.productId,
        name: req.body.productName,
        brand: req.body.brand,
        price: req.body.price,
        color: req.body.color,
        gender: req.body.gender,
        height: req.body.height,
        closure: req.body.closure,
        material: req.body.material,
        category: req.body.category,
      };

      if (req.file) {
        const checktype = req.file.mimetype;
        if (checktype.includes("image")) {
          product.image = "/img/" + req.file.originalname;

          await sharp(req.file.buffer)
            .resize({
              width: 592,
              height: 592,
            })
            .toFile("./public/img/" + req.file.originalname);
        }
        if (!checktype.includes("image")) {
          res.status(400).render(`shop/editProduct`, {
            product: product,
            pageTitle: "Edit product",
            error: "Type of image file is not appropriate",
          });
          return;
        }
      }
      ProductService.updateProduct(product)
        .then((result) => {
          res.status(201).redirect("/products");
        })
        .catch((error) => console.log(error));
    })
  );
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  ProductService.deleteProduct(productId)
    .then(() => {
      res.status(200).redirect("/products");
    })
    .catch((err) => console.log(err));
};

exports.getImportToWarehouse = (req, res, next) => {
  const productId = req.params.productId;
  ProductService.getProduct(productId).then((product) => {
    res.status(200).render("shop/import", {
      product: product,
      pageTitle: "Import goood to the warehouse",
      error: null,
      user: req.user,
    });
  });
};
exports.postImportToWarehouse = (req, res, next) => {
  upload(
    req,
    res,
    (err = async () => {
      console.log("post");
      const product = {
        id: req.body.id,
        countInStock: req.body.sizes,
      };
      ProductService.importToWarehouse(product)
        .then((result) => {
          res.status(201).redirect("/products");
        })
        .catch((error) => console.log(error));
    })
  ).catch((err) => console.log(err));
};
