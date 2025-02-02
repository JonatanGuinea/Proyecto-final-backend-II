import { Router } from 'express';

const router = Router();


router.get('/set', (req, res)=>{
    
    const cookieContent = {user: 'jonatan', email:'este es un email'};

    res.cookie('PrimerCookie',JSON.stringify(cookieContent), {maxAge:10000, signed:true})

    res.status(200).send({error: null,  data: 'Cookie generada'})
})

router.get('/get', (req, res)=>{

    if('PrimerCookie' in req.signedCookies){
        const recievedCookie = JSON.parse(req.signedCookies['PrimerCookie'])
        res.status(200).send({error:null, data: recievedCookie})
    }else{
        res.status(200).send({error:'no hay informacion de cookies', data:[]})
    }

    
})

router.get('/delete', (req, res)=>{

    res.clearCookie('Primer-cookie')
    res.send('detele ok!')
    
})

router.post('/', (req, res)=>{
    const {name, email,check} = req.body;
    const cookieContent = {name, email,check};

    res.cookie('CookieSeteada', JSON.stringify(cookieContent), {maxAge:15000, signed:true})
    res.status(200).send({error:null, data:`cookie seteada: ${JSON.stringify(cookieContent)}`})
})

export default router