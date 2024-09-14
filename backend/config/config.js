// prod config
const dotenv= require("dotenv")
dotenv.config()
const prodConfig = {
    port: 8080 || process.env.PORT,
    mongo_uri:  process.env.MONGO_URI,
}

const devConfig = {
    
}

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

module.exports = config;