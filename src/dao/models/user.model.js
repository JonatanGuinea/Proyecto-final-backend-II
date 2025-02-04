import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number},
    role: { type: String, enum:['ADMIN', 'PREMIUM', 'USER'], default:'USER'}
});

const userModel = mongoose.model(collection, schema);

export default userModel;
