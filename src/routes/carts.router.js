import { Router } from 'express';
import CartController from '../controller/cart.controller.js';
import ProductController from '../controller/products.controller.js';
import Ticket from '../dao/models/ticketModel.js';

const router = Router();
const cartController = new CartController();
const productController = new ProductController();

router.post('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartController.getById(cid);
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        let totalAmount = 0;
        let unprocessedProducts = [];
        let purchasedProducts = [];

        for (const item of cart.products) {
            const product = await productController.getById(item.productId);
            if (!product) {
                unprocessedProducts.push(item.productId);
                continue;
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productController.updateStock(product._id, product.stock);
                totalAmount += product.price * item.quantity;
                purchasedProducts.push(item.productId);
            } else {
                unprocessedProducts.push(item.productId);
            }
        }

        if (purchasedProducts.length > 0) {
            const ticket = await Ticket.create({
                amount: totalAmount,
                purchaser: req.user.email
            });
        }

        await cartController.updateProducts(cid, unprocessedProducts);
        
        res.status(200).send({
            message: 'Compra procesada',
            unprocessedProducts
        });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});

export default router;
