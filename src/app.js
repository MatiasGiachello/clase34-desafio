import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './util.js';
import apiCartRouter from './src/routes/router.cart.js';
import apiProductRouter from './src/routes/router.product.js';
import apiLoggerRouter from './src/routes/router.logger.js';
import viewsRouter from './routes/router.views.js';
import { router as sesionsRouter } from './src/routes/router.sessions.js';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
import inicializaPassport from './middlewares/passport-config.js';
import passport from 'passport';
import { config } from './config/config.js';
import chatController from './controllers/chatController.js'
import { errorHandler } from './errorManagement/errorHandler.js';

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')));
app.use(session({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    store: ConnectMongo.create({
        mongoUrl: config.MONGO_URL
    }),
    ttl: 3600
}))
inicializaPassport();
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/sesions', sesionsRouter)
app.use('/', viewsRouter);
app.use('/api', apiLoggerRouter);
app.use('/api', apiCartRouter);
app.use('/api', apiProductRouter);

app.use(errorHandler)

const PORT = config.PORT;
const server = app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

// dinámica del CHAT
chatController(server)