import * as url from 'url';


const config = {
    PORT: 5050,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    // Constante con la ruta de conexión a la base de datos, en este caso en servidor MongoDB local
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/users',
    MONGODB_URI: 'mongodb+srv://jonatanguinea7:642859Jj642859@cluster0.mesld.mongodb.net/ecommerce',

    SECRET : 'codigoSecreto',

    GITHUB_CLIENT_ID: "Iv23lifxh3zbGdyUZLNJ",
    GITHUB_APP_ID: "1097625",
    GITHUB_SECRET:"f3b0e42820bc541e9a5c2d07e5fe34367c943439",
    GITHUB_CALLBACK_URL: "http://localhost:5050/api/users/ghcallback"
};





export default config;
