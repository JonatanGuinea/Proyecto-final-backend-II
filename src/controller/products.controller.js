import ProductService from "../dao/products.service.js";

const service = new ProductService()

class ProductsController {
    constructor(){

    }

    get = async ()=>{
        return await service.get()
    }
}

export default ProductsController