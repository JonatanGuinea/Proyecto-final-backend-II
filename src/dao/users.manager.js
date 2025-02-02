import userModel from './models/user.model.js';
import {createHash, isValidPassword} from '../utils.js'


class UserManager {
    constructor() {}

    get = async () => {
        try {
            return await userModel.find().lean();
        } catch (err) {
            return null;
        }
    }


    getOne = async (filter) => {
        try {
            return await userModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        };
    };

    
    add = async (data) => {
        try {
            return await(userModel.create(data));
        } catch (err) {
            return null;
        }
    }

    update = async (filter, update, options) => {
        try {
            return await userModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return null;
        }
    }

    delete = async (filter, options) => {
        try {
            return await userModel.findOneAndDelete(filter, options);
        } catch (err) {
            return null;
        }
    }

    /**
     * Agregamos un método simple para autenticar
     * 
     * utiliza findOne para tratar de encontrar un documento que cumpla
     * con el criterio especificado en el filtro, si lo encuentra, lo
     * retorna, caso contrario devuelve null
     */
    authenticate = async (user, pass) => {
        try {
            const filter = { username: user };
            

            //  const filter = { username: user, password: pass };

            const foundUser = await userModel.findOne(filter).lean();
            

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
            const existingUser = await userModel.findOne( {username: data.username} );
    
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


export default UserManager;
