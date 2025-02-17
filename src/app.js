import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors'



import ordersRouter from './routes/order.router.js'
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import cookiesRouter from './routes/cookies.router.js';
import productsRouter from './routes/products.router.js'
import config from './config.js';
import  initAuthStrategies  from "./auth/passport.config.js";
import MongoSingleton from './dao/mongo.singleton.js';


const app = express();

// const filestore = FileStore(session)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(config.SECRET))

app.use(session({
    secret: config.SECRET,
    resave:true,
    saveUninitialized:true,
    // store: new filestore({path:'./session', ttl: 60, retries: 0})

    store: MongoStore.create({mongoUrl: config.MONGODB_URI, ttl:600 , mongoOptions:{}})
}))

app.use(cors({origin:'*', credentials:true}))
// app.use(cors({origin:'http://127.0.0.1:5501', credentials:true}))

initAuthStrategies()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use('/views', viewsRouter);
app.use('/api/orders', ordersRouter)
app.use('/api/users', usersRouter);
app.use('/api/cookies', cookiesRouter);
app.use('/api/products', productsRouter)
app.use('/static', express.static(`${config.DIRNAME}/public`));

// Convertimos el callback del listen en asíncrono y esperamos la conexión a la base de datos
const httpServer = app.listen(config.PORT, async() => {
    //await mongoose.connect(config.MONGODB_URI);
    MongoSingleton.getInstance()
    console.log(`Server activo en puerto ${config.PORT}, conectado a bbdd local`);
    console.log(process.platform);
    
    
    
    const socketServer = new Server(httpServer);
    socketServer.on('connection', socket => {
        console.log(`Nuevo cliente conectado con id ${socket.id}`);
        
    
        socket.on('init_message', data => {
            console.log(data);
        });
    
        socket.emit('welcome', `Bienvenido cliente, estás conectado con el id ${socket.id}`);
    });
});
