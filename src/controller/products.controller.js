import ProductService from "../dao/products.service.js";

const service = new ProductService()

class ProductsController {
    constructor(){

    }

    get = async () => {
        try {
            return await service.get();
        } catch (err) {
            return null;
        } 
    }


    getOne = async (filter) => {
        try {
            return await service.getOne(filter);
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            // const normalizaData = await new UserDTO(data)
            return await service.add(data);
        } catch (err) {
            return null;
        }
    }

    update = async (filter, update, options) => {
        try {
            const response = await service.update(filter, update, options);
            console.log('user controller ' + response);
            
            return response
        } catch (err) {
            return null;
        }
    }

    delete = async (filter, options) => {
        try {
            return await service.delete(filter, options);
        } catch (err) {
            return null;
        }
    }
}

export default ProductsController