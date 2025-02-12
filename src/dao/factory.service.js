import config from "../config.js";

let service;

try{
    switch (config.PERSISTENCE) {
        case 'mongodb':
            const {default: Mongo} = await import('./user.service.mongo.js');
            service = Mongo
            break;
        case 'fsfile':
            const {default: FsFile} = await import('./user.service.file.js')
            service = FsFile;
            break;
    
        default:
            throw new Error("Servicio no importado");
            
            break;
        }
    }catch(err){

        console.error('ERROR al generar servicio bbdd', err.message);

        throw err
        
        
    }

    export default service 