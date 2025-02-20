import { Router } from 'express';
import {auth} from '../middlewares/middlewares.js'
import userModel from '../dao/models/user.model.mongo.js';
import productModel from '../dao/models/product.model.js'
import currentDTO from '../dao/current.dto.js'


const router = Router();

router.get('/', (req, res) => {
    const data = {
        users: users
    };
    
    res.status(200).render('index', data);
});

router.get('/register', (req, res) => {
    const isAdmin = req.session?.userData?.admin;
    const isAuthenticated = req.session?.passport?.user;

    if (isAdmin || isAuthenticated) {
        res.redirect('/views/current')
    }
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
    const isAdmin = req.session?.userData?.admin;
    const isAuthenticated = req.session?.passport?.user;

    if (isAdmin || isAuthenticated) {
        res.redirect('/views/current')
    }
    const data = {
    };
    
    res.status(200).render('login', data);
});

router.get('/current', auth, async (req, res) => {
    try {
        const userId = req.session.passport.user;
        const user = await userModel.findById(userId).lean(); 
        const userFiltered = new currentDTO(user)

        if (!user) {
            res.redirect('/views/login')
        }
        
        console.log(userFiltered);
        

        res.status(200).render('current', { user: userFiltered });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});


router.get('/products', async (req, res) => {
    const products = await productModel.find().lean()

    
    res.render('products', {data:products})
});



export default router;
