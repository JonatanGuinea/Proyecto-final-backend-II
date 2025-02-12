import { Router } from "express";
import ProductsController from "../controller/products.controller.js";

const router = Router()
const controller = new ProductsController()

router.get('/', async (req, res)=>{
    const products = await controller.get()
    res.status(200).send({ error: null , data: products})
})


export default router