import { Router } from 'express';

import { authorization } from '../middlewares/middlewares.js';
import ProductController from '../controller/products.controller.js';
import config from '../config.js';

const router = Router();
const controller = new ProductController();

router.get('/', async (req, res) => {
    try {
        const data = await controller.get();
        console.log(req.body);
        
        res.status(200).send({ error: null, data: data });
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

router.get('/:pid', async (req, res)=>{
    const filter = req.params.pid;
    const product = await controller.getOne({_id:filter})

    res.status(200).send({ error: null , data: product})
})



// 🔹 POST: Crear un nuevo producto
router.post("/", authorization('ADMIN'), async (req, res) => {
    try {
        const newProduct = await controller.add(req.body);
        res.status(201).json({ message: "Producto creado", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto", error });
    }
});

// 🔹 PUT: Actualizar un producto por ID
router.put("/:id", authorization('ADMIN'), async (req, res) => {
    try {
        const { _id } = req.params;
        const updatedProduct = await controller.update(_id, req.body, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error });
    }
});

// 🔹 DELETE: Eliminar un producto por ID
router.delete("/:id", authorization('ADMIN'), async (req, res) => {
    try {
        const { _id } = req.params;
        const deletedProduct = await controller.delete(_id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error });
    }
});

router.all('*', async () => {
    res.status(404).send({ error: 'No se encuentra la ruta especificada', data: [] });
})

export default router;
