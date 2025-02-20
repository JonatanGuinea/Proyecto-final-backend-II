
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import config from './config.js';




export const verifySession = (req, res, next) => {
    if ((req.session?.userData && req.session?.userData.admin)) {
        next();
    } else {
        res.status(401).send({ error: 'No autorizado', data: [] });
    }
}


export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) return res.status(401).send({ error: 'Problemas de autenticación' , data: [] });
            req.user = user;
            next();
        })(req, res, next);
    }
}







export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);






export const createToken = (payload, duration) => jwt.sign(payload, config.SECRET, { expiresIn: duration });






export const verifyToken = (req, res, next) => {
    

    const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`] ? req.cookies[`${config.APP_NAME}_cookie`] : undefined;
    const queryToken = req.query.access_token ? req.query.access_token : undefined;
    const receivedToken = headerToken || cookieToken || queryToken;

    if (!receivedToken) return res.status(401).send({ error: 'Se requiere token', data: [] });

    jwt.verify(receivedToken, config.SECRET, (err, payload) => {
        if (err) return res.status(403).send({ error: 'Token no válido', data: [] });
        
        req.user = payload;
        next();
    });
};



export const handlePolicies = policies => (req, res, next) => {
    const role = req.user.role;
    if (!policies.includes(role)) return res.status(403).send({ error: 'No se cuenta con autorización', data: [] });
    next();
}
