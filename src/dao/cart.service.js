import cartModel from '../dao/models/cart.model.js'
import MongoSingleton from './mongo.singleton.js';


class CartService {
    constructor() {}

    get = async () => {
        try {
            await MongoSingleton.getInstance()
            return await cartModel.find().lean();
        } catch (err) {
            return err.message
        }
    }


    getOne = async (filter) => {
        try {
            await MongoSingleton.getInstance()
            return await cartModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            await MongoSingleton.getInstance()

            return await cartModel.create(data);
        } catch (err) {
            return err.message
        }
    }

    update = async (filter, update, options) => {
        try {
            await MongoSingleton.getInstance()

            return await cartModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message
        }
    }

    delete = async (filter, options) => {
        try {
            await MongoSingleton.getInstance()

            return await cartModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message
        }
    }
    
}


export default CartService;