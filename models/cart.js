const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id,productPrice) {
    // Fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find exhisting product
      const exhistingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const exhistingProduct = cart.products[exhistingProductIndex];
      let updatedProduct;
      // Add New product / increase quantity
      if (exhistingProduct) {
        updatedProduct = { ...exhistingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[exhistingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
          console.log(err);
      })
    });
  }
};
