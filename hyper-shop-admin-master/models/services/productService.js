const Product = require("../product");
const OrderItem = require("../orderItem");

exports.countProducts = (filters) => {
  return Product.find(filters).countDocuments();
};
exports.getProducts = (filters) => {
  return Product.find(filters);
};
exports.getProduct = (id) => {
  return Product.findById(id);
};

exports.createProduct = (newProduct) => {
  const product = new Product({
    name: newProduct.name,
    brand: newProduct.brand,
    price: newProduct.price,
    color: newProduct.color,
    sex: newProduct.gender,
    shoesHeight: newProduct.height,
    closureType: newProduct.closure,
    material: newProduct.material,
    category: newProduct.category,
    image: newProduct.image,
  });
  return product.save();
};

exports.updateProduct = (newProduct) => {
  return Product.findById(newProduct.id).then((product) => {
    product.name = newProduct.name;
    product.brand = newProduct.brand;
    product.price = newProduct.price;
    product.color = newProduct.color;
    product.sex = newProduct.gender;
    product.shoesHeight = newProduct.height;
    product.closureType = newProduct.closure;
    product.material = newProduct.material;
    product.category = newProduct.category;
    if (newProduct.image) product.image = newProduct.image;
    return product.save();
  });
};

exports.importToWarehouse = (updatedProduct) => {
  return Product.findById(updatedProduct.id).then((product) => {
    product.countInStock = updatedProduct.countInStock;
    return product.save();
  });
};

exports.getTopProducts = () => {
  return OrderItem.aggregate([
    { $match: { isOrdered: true } },
    {
      $group: {
        _id: "$product",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
  ]);
};

exports.getCategoriesQuantity = async () => {
  const catsQty = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  const sum = await Product.countDocuments();

  //output [{name,quantity}],sum
  return { catsQty, sum };
};
exports.getBrands = () => {
  return Product.aggregate([
    {
      $group: {
        _id: "$brand",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
};

exports.getClosureTypes = () => {
  return Product.aggregate([
    {
      $group: {
        _id: "$closureType",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
};
exports.getShoesHeights = () => {
  return Product.aggregate([
    {
      $group: {
        _id: "$shoesHeight",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
};
exports.getMaterials = () => {
  return Product.aggregate([
    {
      $group: {
        _id: "$material",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
};

exports.deleteProduct = (productId) => {
  return Product.findByIdAndRemove(productId);
};
