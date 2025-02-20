import productModel from './models/product.model.js';
import MongoSingleton from './mongo.singleton.js';


class ProductService {
    constructor() {}

    get = async () => {
        try {
            await MongoSingleton.getInstance()
            return await productModel.find().lean();
        } catch (err) {
            return err.message
        }
    }


    getOne = async (filter) => {
        try {
            await MongoSingleton.getInstance()
            return await productModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        };
    };
    getOneById = async (filter) => {
        try {
            await MongoSingleton.getInstance()
            return await productModel.getOneById(filter)
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            await MongoSingleton.getInstance()

            return await productModel.create(data);
        } catch (err) {
            return err.message
        }
    }

    update = async (filter, update, options) => {
        try {
            await MongoSingleton.getInstance()

            return await productModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message
        }
    }

    delete = async (filter, options) => {
        try {
            await MongoSingleton.getInstance()

            return await productModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message
        }
    }
    
}


export default ProductService;