import * as url from 'url';


const config = {
    PORT: 5050,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    // Constante con la ruta de conexión a la base de datos, en este caso en servidor MongoDB local
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/users',
    MONGODB_URI: 'mongodb+srv://jonatanguinea7:642859Jj642859@cluster0.mesld.mongodb.net/ecommerce',

    SECRET : 'codigoSecreto',

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_SECRET:process.env.GITHUB_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    MONGODB_ID_REGEX: '/^[a-f\d]{24}$/i'
};





export default config;
