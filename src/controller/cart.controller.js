import CartService from "../dao/cart.service.js";

const service = new CartService();

class CartController {
    constructor() {}

    get = async () => {
        try {
            return await service.get();
        } catch (err) {
            return err.message;
        }
    }

    getOne = async (filter) => {
        try {
            return await service.getOne(filter);
        } catch (err) {
            return err.message;
        };
    };
    getOneById = async (filter) => {
        try {
            return await service.getOneById(filter);
        } catch (err) {
            return err.message;
        };
    };

    add = async (data) => {
        try {
            return await service.add(data);
        } catch (err) {
            return err.message;
        }
    }

    update = async (filter, update, options) => {
        try {
            return await service.update(filter, update, options);
        } catch (err) {
            return err.message;
        }
    }

    delete = async (filter, options) => {
        try {
            return await service.delete(filter, options);
        } catch (err) {
            return err.message;
        }
    }
}

export default CartController
