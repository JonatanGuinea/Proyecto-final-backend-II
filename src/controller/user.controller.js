import UserService from "../dao/user.service.mongo.js";
import {createHash, isValidPassword} from '../utils.js'

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
            return await service.add(data);
        } catch (err) {
            return null;
        }
    }

    update = async (filter, update, options) => {
        try {
            return await service.update(filter, update, options);
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
            
            data.password= createHash(data.password)
            // Guardar usuario en la base de datos
            const newUser = new userModel(data); 
            await newUser.save();
    
            return { success: true, data: 'Usuario registrado correctamente' };
        } catch (err) {
            console.error('❌ Error al registrar usuario:', err);
            return { success: false, error: 'Error en el servidor' };
        }
    }
    
    
}


export default UserController;
