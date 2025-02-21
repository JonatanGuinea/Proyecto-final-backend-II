import {fork} from 'child_process'
import { Router } from 'express';
import passport from 'passport';
// import initAuthStrategies from '../auth/passport.config.js';




import { uploader } from '../uploader.js';
import UserController from '../controller/user.controller.js';
import {createToken, verifyToken, handlePolicies} from '../utils.js'
import config from '../config.js'
import {auth} from '../middlewares/middlewares.js'
import { notifySuccessRegistration } from '../mailer.js';


const router = Router();
const controller = new UserController();


router.param('id', async (req, res, next, id) => {
    // Aprovechamos la expresión regular MONGODB_ID_REGEX,
    // para ver si el id que llega por req.params contiene ese formato
    if (!config.MONGODB_ID_REGEX.test(req.params.id)) return res.status(400).send({ error: 'Formato de Id tipo mongoDB no válido', data: [] });
    next();
})



router.get('/', async (req, res) => {
    try {
        const data = await controller.get();
        
        res.status(200).send({ error: null, data: data });
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

// router.post('/', auth, uploader.array('thumbnail', 3), (req, res) => { // gestión de múltiples archivos
router.post('/', uploader.single('thumbnail'), async (req, res) => { // gestión de archivo único
        try {
            const { firstname, lastname, username, password } = req.body;
    
            if (firstname != '' && lastname != '' && username != '' && password != '') {
                const data = { firstname, lastname, username, password };
                const process = await controller.add(data);
                res.status(200).send({ error: null, data: process });
            } else {
                res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
            }
        } catch (err) {
            res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
        }
});

router.patch('/:id?', async (req, res) => {
        try {
            const id = req.params.id;
            
            if (!id) {
                res.status(400).send({ error: 'Se requiere parámetro id', data: null });
            } else {
                const { firstname, lastname, username, password } = req.body;
    
                const filter = { _id: id };
                const update = {};
                if (firstname) update.firstname = firstname;
                if (lastname) update.lastname = lastname;
                if (username) update.username = username;
                if (password) update.password = password;
                const options = { new: true }; // new: true retorna el documento actualizado
                
                const process = await controller.update(filter, update, options);
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
            
            const process = await controller.delete(filter, options);
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

        const process = await controller.register({ firstname, lastname, username, password });

        if (process.success) {
            notifySuccessRegistration(username)
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
        const process = await controller.authenticate(username, password);
        if (process) {
            req.session.userData = { firstname: process.firstname, lastname: process.lastname, admin: true };

            // Nos aseguramos que los datos de sesión se hayan guardado
            req.session.save(err => {
                if (err) return res.status(500).send({ error: 'Error al almacenar datos de sesión', data: [] });

                // Podemos tanto retornar respuesta como es habitual, o redireccionar a otra plantilla
                res.redirect('/views/current');
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
        res.redirect('/views/current');
    });
});

router.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user:email'] }), async (req, res) => {});
router.get('/ghcallback', passport.authenticate('ghlogin', { failureRedirect: '/views/login' }), async (req, res) => {
    if (!req.user) {
        return res.redirect('/views/login'); // Si no hay usuario, redirige
    }

    req.session.userData = req.user;
    

    req.session.save(err => {
        if (err) {
            console.error('❌ Error al guardar la sesión:', err);
            return res.status(500).send({ error: 'Error al almacenar datos de sesión', data: [] });
        }

        res.redirect('/views/current');
    });
    
});

router.post('/jwtlogin', async (req, res) => {
    const { username, password } = req.body;

    if (username != '' && password != '') {
        const process = await controller.authenticate(username, password);
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

router.get('/complexok', async (req, res) => {
    const child = fork('src/complex.js');

    child.send('start');

    child.on('message', (result) => {
        if (!res.headersSent) { // ✅ Evita múltiples respuestas
            res.status(200).send({ error: null, data: result });
        }
        child.kill(); // ✅ Mata el proceso hijo después de la respuesta
    });

    child.on('error', (err) => {
        if (!res.headersSent) {
            res.status(500).send({ error: 'Error en el proceso hijo', details: err.message });
        }
    });

    child.on('exit', (code) => {
        console.log(`Proceso hijo terminado con código ${code}`);
    });
});

router.get('*',async (req, res)=>{
    res.status(404).send({ error: 'No se encuentra la ruta especificada' , data:[] })
})




export default router;
