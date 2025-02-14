import UserService from "../dao/factory.service.js";
// import UserService from "../dao/user.service.file.js";
import {createHash, isValidPassword} from '../utils.js'
import UserDTO from "../dao/users.dto.js";

const service = new UserService();


class UserController {
    constructor() {}

    get = async () => {
        try {
            return await service.get();
        } catch (err) {
            return null;
        } 
    }


    getOne = async (filter) => {
        try {
            return await service.getOne(filter);
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            const normalizaData = await new UserDTO(data)
            return await service.add(normalizaData);
        } catch (err) {
            return null;
        }
    }

    update = async (filter, update, options) => {
        try {
            const response = await service.update(filter, update, options);
            console.log('user controller ' + response);
            
            return response
        } catch (err) {
            return null;
        }
    }

    delete = async (filter, options) => {
        try {
            return await service.delete(filter, options);
        } catch (err) {
            return null;
        }
    }

    
    authenticate = async (user, pass) => {
        try {
            const filter = { username: user };
            

            //  const filter = { username: user, password: pass };

            const foundUser = await service.getOne(filter);
            

            const validPass = isValidPassword(pass, foundUser.password )

            if(validPass){
                const { password, ...filteredUser } = foundUser;

                return filteredUser;
            }else{
                return null
            }

        } catch (err) {
            return null;
        }
    }

    async register(data) {
        try {
            
    
            if (!data.username) {
                return { success: false, error: 'El campo username es obligatorio' };
            }
    
            // Verificar si ya existe un usuario con el mismo username
            const existingUser = await service.getOne( {username: data.username} );
    
            if (existingUser) {
                return { success: false, error: 'El email o username ya están en uso' };
            }
            const normalizaData = new UserDTO(data)
            // data.password= createHash(data.password)
            // Guardar usuario en la base de datos
            const newUser =await service.add(normalizaData)
            
    
            return { success: true, data: `el usuario ${newUser.firstname}, se registró correctamente` };
        } catch (err) {
            console.error('❌ Error al registrar usuario:', err);
            return { success: false, error: 'Error en el servidor' };
        }
    }
    
    
}


export default UserController;
