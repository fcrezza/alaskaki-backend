import {Model} from "objectmodel";

export const Product = new Model({
  name: String,
  description: String,
  brandId: Number,
  price: Number,
  discount: Number,
  sizes: Array,
  stock: Number
});

export const ProductImage = new Model({
  publicId: Number,
  productId: Number,
  url: String
});
