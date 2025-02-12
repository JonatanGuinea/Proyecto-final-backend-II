import mongoose from 'mongoose';
import { config } from '../../utils.js';

import mongoosePaginate from 'mongoose-paginate-v2';


mongoose.pluralize(null);



const collection = config.PRODUCTS_COLLECTION;

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  }
});

// Aplica el plugin de paginación antes de crear el modelo
schema.plugin(mongoosePaginate);

const model = mongoose.model(collection, schema);

export default model;
