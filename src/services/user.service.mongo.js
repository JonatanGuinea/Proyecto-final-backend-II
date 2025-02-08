import userModel from '../controller/models/user.model.js';
import MongoSingleton from './mongo.singleton.js';


class UserService {
    constructor() {}

    get = async () => {
        try {
            
            return await userModel.find().lean();
        } catch (err) {
            return err.message
        }
    }


    getOne = async (filter) => {
        try {
            return await userModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            return await(userModel.create(data));
        } catch (err) {
            return err.message
        }
    }

    update = async (filter, update, options) => {
        try {
            return await userModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message
        }
    }

    delete = async (filter, options) => {
        try {
            return await userModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message
        }
    }
    
}


export default UserService;
