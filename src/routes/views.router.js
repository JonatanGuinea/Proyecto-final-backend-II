import { Router } from 'express';
import {auth} from './users.router.js'
import userModel from '../dao/models/user.model.mongo.js';



const router = Router();

router.get('/', (req, res) => {
    const data = {
        users: users
    };
    
    res.status(200).render('index', data);
});

router.get('/register', (req, res) => {
    const data = {
    };
    
    // const template = 'register';
    // res.status(200).render(template, data);
    res.status(200).render('register', data);
});

router.get('/chat', (req, res) => {
    const data = {
    };
    
    res.status(200).render('chat', data);
});
router.get('/cookies', (req, res) => {
    const data = {
    };
    
    res.status(200).render('cookies', data);
});
router.get('/login', (req, res) => {
    const data = {
    };
    
    res.status(200).render('login', data);
});

router.get('/profile', auth, async (req, res) => {
    try {
        const userId = req.session.passport.user;
        const user = await userModel.findById(userId).lean(); // `lean()` convierte el resultado en un objeto plano

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.status(200).render('profile', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});



export default router;
