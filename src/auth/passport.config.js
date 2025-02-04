/**
 * En este archivo cargaremos diferentes "estrategias" de Passport, es decir,
 * distintas alternativas a través de las cuales un usuario puede registrarse
 * o autenticarse (local, Github, Facebook, etc)
 */

import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2';


import userManager from '../dao/users.manager.js';
import config from '../config.js'

const manager = new userManager();
const localStrategy = local.Strategy;

const initAuthStrategies = () => {
    passport.use('pplogin', new localStrategy(
        {passReqToCallback: true, usernameField: 'username'},
        async (req, username, password, done) => {
            try {
                if (username != '' && password != '') {
                    // Para simplificar el código, podemos llamar directamente al manager.authenticate(). Ver dao/users.manager.js.
                    const process = await manager.authenticate(username, password);
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
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile._json?.email || null;
                const username = profile.username || profile.id; // Usar el ID de GitHub como fallback
    
                // Si no hay email, usa el username o el ID
                if (email || username) {
                    const foundUser = await manager.getOne({ username: email || username });
    
                    if (!foundUser) {
                        const user = {
                            firstname: profile._json.name.split(' ')[0],
                            lastname: profile._json.name.split(' ')[1],
                            username: email || username,
                            password: 'none'
                        };
    
                        const process = await manager.add(user);
    
                        return done(null, process);
                    } else {
                        return done(null, foundUser);
                    }
                } else {
                    return done(new Error('Faltan datos de perfil'), null);
                }
            } catch (err) {
                return done(err.message, false);
            }
        }
    ));
    

    passport.serializeUser((user, done) => {
        done(null, user);
    });
        
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

export default initAuthStrategies;