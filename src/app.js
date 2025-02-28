import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';

import ordersRouter from './routes/order.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import cookiesRouter from './routes/cookies.router.js';
import productsRouter from './routes/products.router.js';
import config from './config.js';
import initAuthStrategies from './auth/passport.config.js';
import MongoSingleton from './dao/mongo.singleton.js';

const app = express();

// Middleware de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser(config.SECRET));

// Configuración de sesiones
app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: config.MONGODB_URI,
        ttl: 600000,  
    }),
    cookie: {
        maxAge: 60000,  // Cookie expira en 1 minuto
        httpOnly: true,  // Protege contra ataques XSS
        secure: false,   // Establecer en true si usas HTTPS
    }
}));

// CORS (Permitir solicitudes desde cualquier origen durante el desarrollo)
app.use(cors({ origin: '*', credentials: true }));

// Inicializar Passport
initAuthStrategies();
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

// Rutas de la aplicación
app.use('/views', viewsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/cookies', cookiesRouter);
app.use('/api/products', productsRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));

// Iniciar el servidor
const startServer = async () => {
    try {
        // Espera a la conexión a MongoDB
        await MongoSingleton.getInstance();
        console.log('Conectado a la base de datos MongoDB');
        
        const httpServer = app.listen(config.PORT, () => {
            console.log(`Servidor activo en puerto ${config.PORT}`);
        });

        // Inicializar WebSockets
        const socketServer = new Server(httpServer);
        socketServer.on('connection', socket => {
            console.log(`Nuevo cliente conectado con id ${socket.id}`);

            socket.on('init_message', data => {
                console.log(data);
            });

            socket.emit('welcome', `Bienvenido cliente, estás conectado con el id ${socket.id}`);
        });
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
    }
};

startServer();
