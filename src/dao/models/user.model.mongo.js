import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // Puede haber usuarios sin email (GitHub)
    password: { type: String }, // No requerido para autenticación con GitHub
    age: { type: Number },
    role: { type: String, enum: ['ADMIN', 'PREMIUM', 'USER'], default: 'USER' },
    githubId: { type: String, unique: true, sparse: true }, // Identificador único para usuarios de GitHub
    avatar: { type: String } // Para almacenar la foto de GitHub
});

const userModel = mongoose.model(collection, schema);

export default userModel;

