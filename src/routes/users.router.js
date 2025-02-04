import { Router } from 'express';
import passport from 'passport';
import initAuthStrategies from '../auth/passport.config.js';

import { uploader } from '../uploader.js';
import userManager from '../dao/users.manager.js';

import {createToken, verifyToken, handlePolicies} from '../utils.js'

import config from '../config.js'


const router = Router();
const manager = new userManager();


router.param('id', async (req, res, next, id) => {
    // Aprovechamos la expresión regular MONGODB_ID_REGEX,
    // para ver si el id que llega por req.params contiene ese formato
    if (!config.MONGODB_ID_REGEX.test(req.params.id)) return res.status(400).send({ error: 'Formato de Id tipo mongoDB no válido', data: [] });
    next();
})


export const auth = (req, res, next) => {

    if ((req.session?.userData && req.session?.userData.admin) || req.session?.passport.user) {
        next();
    } else {
        res.status(401).send({ error: 'No autorizado', data: [] });
    }
}

router.get('/', async (req, res) => {
    try {
        const data = await manager.get();
        res.status(200).send({ error: null, data: data });
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

// router.post('/', auth, uploader.array('thumbnail', 3), (req, res) => { // gestión de múltiples archivos
router.post('/', uploader.single('thumbnail'), async (req, res) => { // gestión de archivo único
    try {
        const { name, age, email } = req.body;

        if (name != '' && age != '' && email != '') {
            const data = { name: name, age: +age, email: email };
            const process = await manager.add(data);
            res.status(200).send({ error: null, data: process });
        } else {
            res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
        }
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

router.patch('/:id?', auth, async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id) {
            res.status(400).send({ error: 'Se requiere parámetro id', data: null });
        } else {
            const { name, age, email } = req.body;
            const filter = { _id: id };
            const update = {};
            if (name) update.name = name;
            if (age) update.age = +age;
            if (email) update.email = email;
            const options = { new: true }; // new: true retorna el documento actualizado
            
            const process = await manager.update(filter, update, options);
            if (!process) {
                res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
            } else {
                res.status(200).send({ error: null, data: process });
            }
        }
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

router.delete('/:id?', auth, async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id) {
            res.status(400).send({ error: 'Se requiere parámetro id', data: null });
        } else {
            const filter = { _id: id };
            const options = {};
            
            const process = await manager.delete(filter, options);
            if (!process) {
                res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
            } else {
                res.status(200).send({ error: null, data: process });
            }
        }
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, username, password } = req.body;

        if (!firstname || !lastname || !username || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: firstname, lastname, username, password' });
        }

        const process = await manager.register({ firstname, lastname, username, password });

        if (process.success) {
            return res.status(200).json({ error: null, data: process.data });
        } else {
            return res.status(400).json({ error: process.error });
        }
    } catch (error) {
        console.error('❌ Error en /register:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});




router.post('/login', async (req, res) => {
    const { username, password } = req.body;


    if (username != '' && password != '') {
        const process = await manager.authenticate(username, password);
        if (process) {
            req.session.userData = { firstname: process.firstname, lastname: process.lastname, admin: true };

            // Nos aseguramos que los datos de sesión se hayan guardado
            req.session.save(err => {
                if (err) return res.status(500).send({ error: 'Error al almacenar datos de sesión', data: [] });

                // Podemos tanto retornar respuesta como es habitual, o redireccionar a otra plantilla
                res.redirect('/views/profile');
            });
        } else {
            res.status(401).send({ error: 'Usuario o clave no válidos', data: [] });
        }
    } else {
        res.status(400).send({ error: 'Faltan campos: obligatorios username, password', data: [] });
    }
});

router.post('/pplogin', passport.authenticate('pplogin', {}), async (req, res) => {
    // req.user.admin = true; // Hardcoded por ahora
    // req.session.userData = req.user // Este req.user es inyectado automáticamente por passport

    req.session.save(err => {
        if (err) return res.status(500).send({ error: 'Error al almacenar datos de sesión', data: [] });

        // res.status(200).send({ error: null, data: 'Usuario autenticado, sesión iniciada!' });
        res.redirect('/views/profile');
    });
});


router.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user:email'] }), async (req, res) => {});

router.get('/ghcallback', passport.authenticate('ghlogin', { failureRedirect: '/views/login' }), async (req, res) => {
    

    req.session.save(err => {
        if (err) return res.status(500).send({ error: 'Error al almacenar datos de sesión', data: [] });

        // res.status(200).send({ error: null, data: 'Usuario autenticado, sesión iniciada!' });
        res.redirect('/views/profile');
    });
});


router.post('/jwtlogin', async (req, res) => {
    const { username, password } = req.body;

    if (username != '' && password != '') {
        const process = await manager.authenticate(username, password);
        if (process) {
            const payload = { username: username, role: process.role };
            // Generamos un token válido por 1 hora, y se lo devolvemos al cliente en la respuesta
            const token = createToken(payload, '1h');
            res.status(200).send({ error: null, data: { autentication: 'ok', token: token } });
        } else {
            res.status(401).send({ error: 'Usuario o clave no válidos', data: [] });
        }
    } else {
        res.status(400).send({ error: 'Faltan campos: obligatorios username, password', data: [] });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ error: 'Error al cerrar sesión', data: [] });
        
        // res.status(200).send({ error: null, data: 'Sesión cerrada' });
        res.redirect('/views/login');
    });
});

router.get('/private', auth, (req, res) => {
    res.status(200).send({ error: null, data: 'Este contenido solo es visible por usuarios autenticados' });
});


router.get('/private2', verifyToken, handlePolicies(['ADMIN', 'PREMIUM']), (req, res) => {
    res.status(200).send({ error: null, data: 'Este contenido solo es visible por usuarios autenticados' });
});

router.get('*',async (req, res)=>{
    res.status(404).send({ error: 'No se encuentra la ruta especificada' , data:[] })
})



export default router;
