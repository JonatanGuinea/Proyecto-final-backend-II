import orderModel from './models/order.model.js';
import MongoSingleton from './mongo.singleton.js';


class OrderService {
    constructor() {}

    get = async () => {
        try {
            await MongoSingleton.getInstance()
            return await orderModel.find().lean();
        } catch (err) {
            return err.message
        }
    }


    getOne = async (filter) => {
        try {
            await MongoSingleton.getInstance()
            return await orderModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            await MongoSingleton.getInstance()

            return await(orderModel.create(data));
        } catch (err) {
            return err.message
        }
    }

    update = async (filter, update, options) => {
        try {
            await MongoSingleton.getInstance()

            return await orderModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message
        }
    }

    delete = async (filter, options) => {
        try {
            await MongoSingleton.getInstance()

            return await orderModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message
        }
    }
    
}


export default OrderService;