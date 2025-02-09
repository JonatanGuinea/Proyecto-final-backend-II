import * as url from 'url';
import dotenv from 'dotenv'
import { Command } from 'commander';

//en cas de no usa --env-files=.env, necesitaremos la siguiente límnea de comandos que ejecuta el dotenv para leer las variables de entorno establecidas
dotenv.config({path: '.env'})

const commandLine = new Command()

commandLine
    .option('--mode <mode>')
    .option('--port <port>')

    commandLine.parse()

const clOptions = commandLine.opts()


const config = {
    PORT:process.env.PORT ||clOptions.port|| 5080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    
    
    
    SECRET : 'codigoSecreto',
    
    MONGODB_URI: process.env.MONGODB_URI,
    // Constante con la ruta de conexión a la base de datos, en este caso en servidor MongoDB local
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/users',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_SECRET:process.env.GITHUB_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,



    MONGODB_ID_REGEX: '/^[a-f\d]{24}$/i'
};





export default config;
