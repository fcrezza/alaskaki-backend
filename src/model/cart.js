import {Model} from "objectmodel";

import {Product} from "./product";

const CartItem = new Model({
  userId: Number,
  product: Product,
  quantity: Number,
  price: Number
});

export default CartItem;
