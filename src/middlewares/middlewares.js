export const auth = (req, res, next) => {
    console.log(req.session.userData);
    
    if (req.session?.passport?.user) {
        return next();
    }
    res.status(401).send({ error: 'No autorizado' });
};

export const authorization = (role) => {
    return (req, res, next) => {
        if (!req.session?.passport?.user) {
            return res.status(401).send({ error: 'No autenticado' });
        }

        const userRole = req.session?.userData?.role;
        if (!userRole || userRole !== role) {
            return res.status(403).send({ error: 'No autorizado' });
        }

        next();
    };
};