import {Model} from "objectmodel";

const Transaction = new Model({
  userId: Number,
  productId: Number,
  quantity: Number,
  price: Number,
  status: ["Success", "Failed"],
  note: [String]
});

export default Transaction;
