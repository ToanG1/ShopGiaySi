const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  color: String,
  sex: String,
  shoesHeight: String,
  closureType: String,
  material: String,
  category: {
    type: String,
    required: true,
  },

  viewCount: {
    type: Number,
    default: 0,
  },
  //ảnh chính
  image: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
  countInStock: {
    type: [
      {
        size: Number,
        quantity: Number,
      },
    ],
    required: true,
  },
});

productSchema.methods.Description = function () {
  return `Color of ${this.color}, has ${this.shoesHeight}, uses ${this.closureType}`;
};

const Product = mongoose.model("Product", productSchema);

function countProducts(filters) {
  return Product.find(filters).countDocuments();
}
function getProducts(filters) {
  return Product.find(filters);
}
function getProduct(id) {
  return Product.findById(id);
}

function createProduct(newProduct) {
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
}

function updateProduct(newProduct) {
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
}

function importToWarehouse(updatedProduct) {
  return Product.findById(updatedProduct.id).then((product) => {
    console.log("hi");
    const arr = Array.from(product.countInStock, ([size, quantity]) => ({
      size,
      quantity,
    }));
    console.log(arr);
    //product.countInStock = updateProduct.countInStock;
  });
}

async function getCategoriesQuantity() {
  let res = [];
  let cats = [];
  cats = await Product.distinct("category");
  for (c of cats) {
    const quantity = await Product.count({ category: c });
    res.push({
      name: c,
      quantity,
    });
  }
  return res;
}

function deleteProduct(productId) {
  return Product.findByIdAndRemove(productId);
}

module.exports = Product;
