import userModel from './models/user.model.mongo.js';
import MongoSingleton from './mongo.singleton.js';


class UserService {
    constructor() {}

    get = async () => {
        try {
            await MongoSingleton.getInstance()
            return await userModel.find().lean();
        } catch (err) {
            return err.message
        }
    }


    getOne = async (filter) => {
        try {
            await MongoSingleton.getInstance()
            return await userModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            await MongoSingleton.getInstance()

            return await userModel.create(data);
        } catch (err) {
            return err.message
        }
    }

    update = async (filter, update, options) => {
        try {
            await MongoSingleton.getInstance()
            const response = await userModel.findOneAndUpdate(filter, update, options);
            console.log('user service : ' + response);
            
            return response
        } catch (err) {
            return err.message
        }
    }

    delete = async (filter, options) => {
        try {
            await MongoSingleton.getInstance()

            return await userModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message
        }
    }
    
}


export default UserService;
