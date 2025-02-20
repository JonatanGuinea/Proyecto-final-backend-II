import { Router } from 'express';
import CartController from '../controller/cart.controller.js';
import ProductController from '../controller/products.controller.js';
import ticketModel from '../dao/models/ticketModel.js';
import {auth} from '../middlewares/middlewares.js'


const router = Router();
const cartController = new CartController();
const productController = new ProductController();

router.get('/', auth, async (req, res) => {
    try {
        // Esperamos a que se obtenga la lista de carritos
        const carts = await cartController.get();

        // Mostramos la información del usuario en sesión (si la necesitas para depurar)

        // Enviamos la respuesta con los carritos
        res.status(200).send({ error: null, data: carts });
    } catch (error) {
        // Si hay un error, lo manejamos adecuadamente
        console.error(error);
        res.status(500).send({ error: 'Error interno al obtener los carritos', data: [] });
    }
});

router.get('/:cid', async (req, res)=>{
    const cartId = req.params.cid;
    const cart = await cartController.getOne({_id:cartId});
    res.status(200).send({ error: null , data: [cart]})
} )



router.post('/add', auth, async (req, res) => {
    try {

        const { productId, stock} = req.body;

        if (!productId || stock <= 0) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        // Verificar si el producto existe
        const product = await productController.getOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Buscar el carrito del usuario
        let cart = await cartController.getOne({ _id: req.session.userData });
        

        // Si no tiene un carrito, crearlo
        if (!cart) {
            cart = await cartController.create({ userId, products: [] });
        }
console.log(req.user);

        // Verificar si el producto ya está en el carrito
        // const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        // if (productIndex !== -1) {
        //     // Si el producto ya está en el carrito, aumentar la cantidad
        //     cart.products[productIndex].quantity += quantity;
        // } else {
        //     // Si no está, agregarlo al carrito
        //     cart.products.push({ productId, quantity });
        // }

        // // Guardar el carrito actualizado
        // await cartController.update(cart._id, { products: cart.products });

        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params;

        // Verificar usuario autenticado
        if (!req.user || !req.user.email) {
            return res.status(400).send({ error: 'Usuario no autenticado' });
        }

        const cart = await cartController.getOne({ _id: cid });
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        let totalAmount = 0;
        let unprocessedProducts = [];
        let purchasedProducts = [];

        for (const item of cart.products) {
            const product = await productController.getOne({ _id: item.productId });

            if (!product) {
                unprocessedProducts.push(item.productId);
                continue;
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productController.update(product._id, { stock: product.stock });

                totalAmount += product.price * item.quantity;
                purchasedProducts.push(item.productId);
            } else {
                unprocessedProducts.push(item.productId);
            }
        }

        let ticket = null;
        if (purchasedProducts.length > 0) {
            ticket = await ticketModel.create({
                amount: totalAmount,
                purchaser: req.user.email
            });
        }

        await cartController.update(cid, unprocessedProducts);

        res.status(200).send({
            message: 'Compra procesada',
            ticket,
            unprocessedProducts
        });
    } catch (error) {
        console.error('Error en la compra:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});



// Agregar un producto al carrito
router.post("/:cartId/products/:productId", async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body; 

        
        const cart = await cartController.getOneById(cartId)
        const product = await productController.getOneById(productId);

        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        
        const existingProduct = cart.products.find(p => p._id.equals(productId));

        if (existingProduct) {
            
            existingProduct.quantity += quantity || 1;
        } else {
            
            cart.products.push({ productId, quantity: quantity || 1 });
        }

        
        await cart.save();

        res.status(200).json({ message: "Producto agregado al carrito", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar producto al carrito", error });
    }
});



export default router;
