/**
 * En este archivo cargaremos diferentes "estrategias" de Passport, es decir,
 * distintas alternativas a través de las cuales un usuario puede registrarse
 * o autenticarse (local, Github, Facebook, etc)
 */

import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2';


import UserController from '../controller/user.controller.js';
import config from '../config.js'

const controller = new UserController();
const localStrategy = local.Strategy;

const initAuthStrategies = () => {
    passport.use('pplogin', new localStrategy(
        {passReqToCallback: true, usernameField: 'username'},
        async (req, username, password, done) => {
            try {
                if (username != '' && password != '') {
                    // Para simplificar el código, podemos llamar directamente al controller.authenticate(). Ver controller/user.controller.js.
                    const process = await controller.authenticate(username, password);
                    if (process) {
                        // Si el username (email) y los hash coinciden, process contendrá los datos de usuario,
                        // simplemente retornamos esos datos a través de done(), Passport los inyectará en el
                        // objeto req de Express, como req.user.
                        return done(null, process);
                    } else {
                        return done('Usuario o clave no válidos', false);
                    }
                } else {
                    return done('Faltan campos: obligatorios username, password', false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('ghlogin', new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL,
            scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
    
                let email = profile.emails?.[0]?.value || profile._json?.email || null;
                let username = profile.username || profile.id;
    
                if (!email && !username) {
                    console.error('❌ No se pudo obtener email ni username');
                    return done(null, false, { message: 'No se pudo obtener email ni username' });
                }
    
                let user = await controller.getOne({ username: email || username });
    
                if (!user) {
                    user = await controller.add({
                        firstname: profile.displayName?.split(' ')[0] || 'GitHub',
                        lastname: profile.displayName?.split(' ')[1] || 'User',
                        username: email || username,
                        password: 'none'
                    });
                }
    
                return done(null, user);
            } catch (err) {
                console.error('❌ Error en estrategia GitHub:', err);
                return done(err, false);
            }
        }
    ));
    
    

    passport.serializeUser((user, done) => {
        done(null, user._id);  // Solo almacena el ID del usuario en la sesión
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await controller.getOne({ _id: id });  // Busca el usuario en la DB
            done(null, user);
        } catch (err) {
            done(err, 'error en deserializer');
        }
    });
    
};

export default initAuthStrategies;