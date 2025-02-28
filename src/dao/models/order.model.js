import mongoose from "mongoose";
import userModel from "./user.model.mongo.js";
import productModel from './product.model.js';

mongoose.pluralize(null);

const collection = 'orders';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    qty: { type: Number, required: true }
  }],
  total: { type: Number }
});

// Middleware para popular las referencias
schema.pre('find', function () {
  this.populate({ path: 'user', model: userModel, select: '-role -password' })
      .populate({ path: 'products.product', model: productModel });
});

const model = mongoose.model(collection, schema);

export default model;
