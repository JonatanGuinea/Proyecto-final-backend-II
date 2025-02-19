import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true, min: 1 }
    }]
}, { timestamps: true });

// Middleware para popular referencias
schema.pre('find', function () {
    this.populate('users').populate('products');
});

const model = mongoose.model(collection, schema);

export default model;
