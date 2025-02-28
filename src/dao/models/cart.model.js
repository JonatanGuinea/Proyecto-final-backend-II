import mongoose from "mongoose";
import userModel from "./user.model.mongo.js";
import productModel from './product.model.js';

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true, min: 1 }
  }]
}, { timestamps: true });

// Middleware para popular las referencias
schema.pre('find', function () {
  this.populate('user').populate('products.productId'); // Cambié 'products' a 'productId'
});

const model = mongoose.model(collection, schema);

export default model;
